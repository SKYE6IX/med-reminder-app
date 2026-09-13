import { ThemedText } from "@/component/themed-text/themed-text";
import AppleSignIn from "@/component/ui/apple-sign-in";
import CustomButton from "@/component/ui/custom-button/custom-button";
import FormHeader from "@/component/ui/form/form-header";
import FormInput from "@/component/ui/form/form-input";
import Loader from "@/component/ui/loader";
import { QueryKey } from "@/constants/query-keys";
import { logOverdueEvents } from "@/helpers/log-overdue-event";
import { NotificationHelper } from "@/helpers/notification-helper";
import { scheduleNewMedicationNotifications } from "@/helpers/schedule-new-event-notifications";
import { scheduleNextMedicationEvents } from "@/helpers/schedule-next-medication-events";
import { syncSubscriptionWithServer } from "@/helpers/sync-subscription-with-server";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useTranslation } from "@/i18next/i18next";
import { useAppSettingsStore } from "@/stores/app-settings-store";
import { useFeedBackStore } from "@/stores/feedback-store";
import { useAuthStore } from "@/stores/use-auth-store";
import { AuthResponse } from "@/types/auth-response";
import { api, axios } from "@/utils/axiosInstance";
import { queryClient } from "@/utils/query-client";
import { clearTokens, saveTokens } from "@/utils/tokenUtils";
import { validateSignInInputs } from "@/utils/validator";
import { useMutation } from "@tanstack/react-query";
import { Link } from "expo-router";
import { useRef, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

type FormState = {
  email: string;
  password: string;
};

type SignInState = {
  formState: FormState;
  errorsSet: Set<string>;
};

const signInMutation = async (formState: FormState) => {
  const response = await api.post<AuthResponse>("auth/login", formState);
  return response.data;
};

export default function SignInScreen() {
  const { t } = useTranslation();
  const { showFeedBack } = useFeedBackStore();
  const { setIsAuthenticated } = useAuthStore();
  const [signInState, setSignInState] = useState<SignInState>({
    formState: {
      email: "",
      password: "",
    },
    errorsSet: new Set(),
  });

  const insets = useSafeAreaInsets();
  const emaiInputRef = useRef<TextInput>(null);

  const linkColor = useThemeColor({}, "buttonPrimaryBg");
  const backgroundColor = useThemeColor({}, "backgroundPrimary");

  // Handle when each text input value changes
  const handleOnValueChanges = ({ name, value }: { name: string; value: string }) => {
    setSignInState((prvState) => {
      const updatedErrors = new Set(prvState.errorsSet);
      updatedErrors.delete(name);
      return {
        ...prvState,
        formState: {
          ...prvState.formState,
          [name]: value,
        },
        errorsSet: updatedErrors,
      };
    });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: signInMutation,
    async onSuccess(data) {
      await clearTokens();
      await saveTokens(data.accessToken, data.refreshToken);
      await queryClient.invalidateQueries({ queryKey: [QueryKey.users] });

      const [overdueResult, subscriptionResult] = await Promise.allSettled([
        logOverdueEvents(),
        syncSubscriptionWithServer(),
      ]);

      if (overdueResult.status === "rejected") {
        console.log("Overdue api called failed: ", overdueResult.reason);
      }
      if (subscriptionResult.status === "rejected") {
        console.log("Subscription sync api called failed: ", subscriptionResult.reason);
      }

      await scheduleNextMedicationEvents();
      await NotificationHelper.cancelAllNotifications();
      await scheduleNewMedicationNotifications({
        ...useAppSettingsStore.getState().notfication,
        ...useAppSettingsStore.getState().reminderPreferences,
      });

      setIsAuthenticated(true);
    },

    onError(error) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ERR_NETWORK") {
          showFeedBack({
            title: t("feedback.error.network.title"),
            message: t("feedback.error.network.text"),
            status: "error",
          });
        } else if (error.response?.status === 401) {
          showFeedBack({
            title: t("feedback.error.authorized.title"),
            message: t("feedback.error.authorized.text"),
            status: "error",
          });
        }
        console.log("An axios error occur in sign in mutation", error);
      } else {
        console.log("An unknown error occur in sign in mutation", error);
      }
    },
  });

  // Handle the submission of form
  const handleSubmitForm = async () => {
    // Check all field are filled correctly.
    const validatedInputs = validateSignInInputs(signInState.formState);
    if (validatedInputs.error) {
      validatedInputs.error.issues.forEach((issue) => {
        setSignInState((prvState) => {
          return {
            ...prvState,
            errorsSet: new Set(prvState.errorsSet).add(issue.path[0].toString()),
          };
        });
      });
      return;
    }
    mutate({ ...validatedInputs.data });
  };

  return (
    <SafeAreaView
      style={{ paddingTop: insets.top + 10, paddingBottom: 10, backgroundColor, flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ flex: 1 }}>
        <View style={styles.container}>
          <Loader visible={isPending} />
          <FormHeader title={t("sign_in_screen.title")} subTitle={t("sign_in_screen.sub_title")} />
          <View style={styles.inputsWrapper}>
            <FormInput
              label={t("common.form.email_label")}
              name="email"
              onValueChange={handleOnValueChanges}
              inputRef={emaiInputRef}
              type="email"
              placeholder={t("common.form.email_placeholder")}
              hasError={signInState.errorsSet.has("email")}
            />
            <FormInput
              label={t("common.form.password_label")}
              name="password"
              onValueChange={handleOnValueChanges}
              type="password"
              placeholder={t("common.form.password_placeholder")}
              hasError={signInState.errorsSet.has("password")}
              textContentType="password"
              autoComplete="password"
            />
          </View>

          <View style={styles.submitButtonWrapper}>
            <CustomButton
              label={t("sign_in_screen.sign_in_btn")}
              onPress={handleSubmitForm}
              disabled={isPending}
            />
            <View style={styles.resetPassword}>
              <ThemedText style={styles.resetPasswordText}>
                {t("sign_in_screen.forget_password")}
              </ThemedText>
              <Link href="/forget-password" asChild>
                <Pressable>
                  <Text style={[styles.resetPasswordText, { color: linkColor }]}>
                    {t("sign_in_screen.click_here")}
                  </Text>
                </Pressable>
              </Link>
            </View>
          </View>

          {Platform.OS === "ios" && (
            <View style={styles.socialButtonWrapper}>
              <View style={styles.dividerWrapper}>
                <View style={styles.divider} />
                <ThemedText style={styles.dividerText}>{t("sign_in_screen.or")}</ThemedText>
                <View style={styles.divider} />
              </View>
              <AppleSignIn type="SIGN_IN" />
            </View>
          )}

          <View style={styles.footerWrapper}>
            <ThemedText style={styles.footerText}>{t("sign_in_screen.no_account")}</ThemedText>
            <Link href="/create-account" asChild>
              <Pressable>
                <Text style={[styles.footerText, { color: linkColor }]}>
                  {t("sign_in_screen.sign_up")}
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    gap: 30,
  },
  inputsWrapper: {
    gap: 16,
  },
  submitButtonWrapper: {
    gap: 16,
  },
  resetPassword: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 2,
  },
  resetPasswordText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
    lineHeight: 18.2,
    textAlign: "center",
  },

  socialButtonWrapper: {
    gap: 12,
  },
  dividerWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  divider: {
    height: 1,
    flex: 1,
    backgroundColor: "#868686",
  },
  dividerText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    lineHeight: 16.8,
  },
  footerWrapper: {
    marginTop: "auto",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  footerText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
    lineHeight: 18.2,
    textAlign: "center",
  },
});
