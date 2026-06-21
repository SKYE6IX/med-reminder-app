import FormHeader from "@/component/ui/form/form-header";
import FormInput from "@/component/ui/form/form-input";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CustomButton from "@/component/ui/custom-button/custom-button";
import { saveToStorage } from "@/helpers/storage-manager";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useFeedBackStore } from "@/stores/feedback-store";
import { api, axios } from "@/utils/axiosInstance";
import { validateResetPasswordInputs } from "@/utils/validator";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

const STORAGE_KEY_EMAIL = "password:reset:email";

const requestPasswordResetTokenMutation = async ({ email }: { email: string }) => {
  const reponse = await api.post<{ status: string }>("auth/forget-password/token", { email });
  return reponse.data;
};

export default function ForgetPasswordScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showFeedBack } = useFeedBackStore();

  const [email, setEmail] = useState("");
  const [showError, setShowError] = useState(false);

  const { mutate } = useMutation({
    mutationFn: requestPasswordResetTokenMutation,
    onError(error) {
      if (axios.isAxiosError(error)) {
        error.response?.status === 401 &&
          showFeedBack({
            title: "Не удалось авторизовать!",
            message: "Пользователь с таким адресом электронной почты не существует!",
            status: "error",
          });
      } else {
        showFeedBack({
          title: "Ошибка!",
          message: "Что-то пошло не так. Пробовать снова.",
          status: "error",
        });
        console.log("An unknown error occur in sign in mutation", error);
      }
    },
  });

  const handleContinueToOTP = async () => {
    const validInputEmail = validateResetPasswordInputs({ email });
    if (validInputEmail.error) {
      setShowError(true);
      return;
    }

    await saveToStorage(STORAGE_KEY_EMAIL, email);
    router.navigate("/forget-password/otp");
    setEmail("");
    mutate({ email });
  };

  // Themes
  const backgroundColor = useThemeColor({}, "backgroundPrimary");
  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top * 2, backgroundColor }}>
      <View style={[{ paddingBottom: insets.bottom }, styles.container]}>
        <FormHeader title="Забыли пароль?" subTitle="Введите данные для восстановления аккаунта" />
        <FormInput
          label="Почта"
          onValueChange={({ value }) => {
            setEmail(value);
            setShowError(false);
          }}
          type="email"
          name="email"
          placeholder="Введите Вашу почту"
          hasError={showError}
        />
        <CustomButton label="Восстановить пароль" onPress={handleContinueToOTP} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    gap: 32,
  },
});
