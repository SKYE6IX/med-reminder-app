import { QueryKey } from "@/constants/query-keys";
import { NotificationHelper } from "@/helpers/notification-helper";
import { scheduleNextMedicationNotifications } from "@/helpers/schedule-next-event-notifications";
import { useAppSettingsStore } from "@/stores/app-settings-store";
import { useFeedBackStore } from "@/stores/feedback-store";
import { useAuthStore } from "@/stores/use-auth-store";
import { AuthResponse } from "@/types/auth-response";
import { SocialAuthRequest } from "@/types/user";
import { api, axios } from "@/utils/axiosInstance";
import { queryClient } from "@/utils/query-client";
import { clearTokens, saveTokens } from "@/utils/tokenUtils";
import { useMutation } from "@tanstack/react-query";
import * as AppleAuthentication from "expo-apple-authentication";
import { StyleSheet, View } from "react-native";
import Loader from "./loader";

type AppleSignInProps = {
  type: "SIGN_IN" | "SIGN_UP";
};

const authorizeWithApple = async (request: SocialAuthRequest) => {
  const reposnse = await api.post<AuthResponse>("auth/social", request);
  return reposnse.data;
};

export default function AppleSignIn({ type }: AppleSignInProps) {
  const { setIsAuthenticated } = useAuthStore();
  const { showFeedBack } = useFeedBackStore();

  const { isPending, mutate } = useMutation({
    mutationFn: authorizeWithApple,
    async onSuccess(data) {
      clearTokens();
      saveTokens(data.accessToken, data.refreshToken);
      await queryClient.invalidateQueries({ queryKey: [QueryKey.users] });
      setIsAuthenticated(true);

      await NotificationHelper.cancelAllNotifications();

      await scheduleNextMedicationNotifications({
        ...useAppSettingsStore.getState().notfication,
        ...useAppSettingsStore.getState().reminderPreferences,
      });
    },

    onError(error) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ERR_NETWORK") {
          showFeedBack({
            title: "Ошибка сети!",
            message: "Проверьте подключение к интернету.",
            status: "error",
          });
        } else if (error.response?.status === 401) {
          showFeedBack({
            title: "Не удалось авторизоваться",
            message: "Неверный адрес электронной почты или пароль.",
            status: "error",
          });
        }
      } else {
        console.log("An unknown error occur in apple sign in mutation", error);
      }
    },
  });

  return (
    <View style={styles.container}>
      <Loader visible={isPending} />
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType[type]}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={16}
        style={styles.button}
        onPress={async () => {
          try {
            const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
              ],
            });

            const familyName = credential.fullName?.familyName ?? "";
            const givenName = credential.fullName?.givenName ?? "";

            const requestBody: SocialAuthRequest = {
              providerId: credential.user,
              authorizationCode: credential.authorizationCode ?? "",
              provider: "APPLE",
              fullName: familyName + " " + givenName,
              email: credential.email ?? "",
              jwtToken: credential.identityToken ?? "",
            };

            mutate(requestBody);
          } catch (e) {
            //@ts-expect-error Error type isn't available
            if (e.code === "ERR_REQUEST_CANCELED") {
              console.log("Apple error -> ", e);
              // handle that the user canceled the sign-in flow
            } else {
              // handle other errors
              console.log("Unknow Apple error -> ", e);
            }
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: "100%",
    height: 48,
  },
});
