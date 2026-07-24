import FormHeader from "@/component/ui/form/form-header";
import FormInput from "@/component/ui/form/form-input";
import { Link } from "expo-router";
import { useRef, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/component/themed-text/themed-text";
import CustomButton from "@/component/ui/custom-button/custom-button";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuthStore } from "@/stores/use-auth-store";
import { validateCreateAccountInputs } from "@/utils/validator";

import AppleSignIn from "@/component/ui/apple-sign-in";
import Loader from "@/component/ui/loader";
import { NotificationHelper } from "@/helpers/notification-helper";
import { useTranslation } from "@/i18next/i18next";
import { useFeedBackStore } from "@/stores/feedback-store";
import { AuthResponse } from "@/types/auth-response";
import { api, axios } from "@/utils/axiosInstance";
import { queryClient } from "@/utils/query-client";
import { clearTokens, saveTokens } from "@/utils/tokenUtils";
import { useMutation } from "@tanstack/react-query";
import { Trans } from "react-i18next";

type FormState = {
  email: string;
  name: string;
  password: string;
};

type CreateAccountState = {
  formState: FormState;
  errorsSet: Set<string>;
};

const createAccountMutation = async (formState: FormState) => {
  const response = await api.post<AuthResponse>("auth/register", formState);
  return response.data;
};

export default function CreateAccountScreen() {
  const { t } = useTranslation();
  const { showFeedBack } = useFeedBackStore();
  const { setIsAuthenticated } = useAuthStore();
  const [createAccountState, setCreateAccountState] = useState<CreateAccountState>({
    formState: {
      email: "",
      name: "",
      password: "",
    },
    errorsSet: new Set(),
  });

  const insets = useSafeAreaInsets();
  const textInputRef = useRef<TextInput>(null);
  const emaiInputRef = useRef<TextInput>(null);

  const linkColor = useThemeColor({}, "buttonPrimaryBg");
  const backgroundColor = useThemeColor({}, "backgroundPrimary");

  // Handle when each text input value changes
  const handleOnValueChanges = ({ name, value }: { name: string; value: string }) => {
    setCreateAccountState((prvState) => {
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
    mutationFn: createAccountMutation,
    async onSuccess(data) {
      await clearTokens();
      await saveTokens(data.accessToken, data.refreshToken);
      setIsAuthenticated(true);

      await Promise.all([
        NotificationHelper.cancelAllNotifications(),
        queryClient.invalidateQueries({ queryKey: ["users"] }),
      ]);
    },
    onError(error) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ERR_NETWORK") {
          showFeedBack({
            title: t("feedback.error.network.title"),
            message: t("feedback.error.network.text"),
            status: "error",
          });
        } else {
          showFeedBack({
            title: t("feedback.error.general.title"),
            message: t("feedback.error.general.text"),
            status: "error",
          });
        }
        console.log("An axios error occur  in create account mutation: ", error);
      } else {
        console.log("An unknown error occur in create account mutation: ", error);
      }
    },
  });

  // Handle the submission of form
  const handleSubmitForm = async () => {
    // Check all field are filled correctly.
    const validatedInputs = validateCreateAccountInputs(createAccountState.formState);
    if (validatedInputs.error) {
      validatedInputs.error.issues.forEach((issue) => {
        setCreateAccountState((prvState) => {
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
          <FormHeader title={t("sign_up_screen.title")} subTitle={t("sign_up_screen.sub_title")} />
          <View style={styles.inputsWrapper}>
            <FormInput
              label={t("common.form.name_label")}
              name="name"
              onValueChange={handleOnValueChanges}
              inputRef={textInputRef}
              type="text"
              placeholder={t("common.form.name_placeholder")}
              hasError={createAccountState.errorsSet.has("name")}
            />
            <FormInput
              label={t("common.form.email_label")}
              name="email"
              onValueChange={handleOnValueChanges}
              inputRef={emaiInputRef}
              type="email"
              placeholder={t("common.form.email_placeholder")}
              hasError={createAccountState.errorsSet.has("email")}
            />
            <FormInput
              label={t("common.form.password_label")}
              name="password"
              onValueChange={handleOnValueChanges}
              type="password"
              placeholder={t("common.form.password_placeholder")}
              hasError={createAccountState.errorsSet.has("password")}
              textContentType="newPassword"
              autoComplete="new-password"
            />
          </View>

          <View style={styles.submitButtonWrapper}>
            <CustomButton
              label={t("sign_up_screen.create_account_btn")}
              onPress={handleSubmitForm}
              disabled={isPending}
            />
            <ThemedText style={styles.termsText}>
              <Trans
                i18nKey="sign_up_screen.terms_and_policy"
                components={{
                  termsLink: (
                    <Link href="https://medremindr.ru/terms" style={{ color: linkColor }} />
                  ),
                  privacyLink: (
                    <Link href="https://medremindr.ru/privacy" style={{ color: linkColor }} />
                  ),
                }}
              />
            </ThemedText>
          </View>

          {Platform.OS === "ios" && (
            <View style={styles.socialButtonWrapper}>
              <View style={styles.dividerWrapper}>
                <View style={styles.divider} />
                <ThemedText style={styles.dividerText}>{t("sign_up_screen.or")}</ThemedText>
                <View style={styles.divider} />
              </View>
              <AppleSignIn type="SIGN_UP" />
            </View>
          )}

          <View style={styles.footerWrapper}>
            <ThemedText style={styles.footerText}>{t("sign_up_screen.have_account")}</ThemedText>
            <Link href="/sign-in" asChild>
              <Pressable>
                <Text style={[styles.footerText, { color: linkColor }]}>
                  {t("sign_up_screen.sign_in")}
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
  termsText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 12,
    lineHeight: 14.5,
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
