import CustomButton from "@/component/ui/custom-button/custom-button";
import FormHeader from "@/component/ui/form/form-header";
import FormInput from "@/component/ui/form/form-input";
import Loader from "@/component/ui/loader";
import { readFromStorage, removeFromStorage } from "@/helpers/storage-manager";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useFeedBackStore } from "@/stores/feedback-store";
import { api, axios } from "@/utils/axiosInstance";
import { clearTokens } from "@/utils/tokenUtils";
import { validateResetPasswordInputs } from "@/utils/validator";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const STORAGE_KEY_EMAIL = "password:reset:email";
const STORAGE_KEY_TOKEN = "password:reset:token";

interface PasswordResetRequest {
  email: string;
  token: number;
  newPassword: string;
}

const resetPasswordMutation = async (requestBody: PasswordResetRequest) => {
  const response = await api.post("auth/forget-password", requestBody);
  return response.data;
};

export default function NewPasswordScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showFeedBack } = useFeedBackStore();

  const backgroundColor = useThemeColor({}, "backgroundPrimary");
  const [resetPassword, setResetPassword] = useState({ newPassword: "", repeatPassword: "" });
  const [inputErrorList, setInputErrorList] = useState([""]);

  const handleOnTextInputChange = ({ name, value }: { name: string; value: string }) => {
    setResetPassword((prvState) => ({ ...prvState, [name]: value }));
    // Reset the error list if exist
    setInputErrorList((prvState) => {
      return prvState.filter((e) => e !== name);
    });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: resetPasswordMutation,
    async onSuccess() {
      showFeedBack({
        title: "Пароль изменен!",
        message: "Успешно смените пароль!",
        status: "success",
      });
      clearTokens();
      router.navigate("/(auth)/sign-in");
      await Promise.all([
        removeFromStorage(STORAGE_KEY_EMAIL),
        removeFromStorage(STORAGE_KEY_TOKEN),
      ]);
    },
    onError(error) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ERR_NETWORK") {
          showFeedBack({
            title: "Ошибка сети!",
            message: "Проверьте подключение к интернету.",
            status: "error",
          });
        } else {
          showFeedBack({
            title: "Ошибка!",
            message: "Что-то пошло не так. Пробовать снова.",
            status: "error",
          });
        }
      }
    },
  });

  const handleResetPassword = async () => {
    const validInputEmail = validateResetPasswordInputs({ newPassword: resetPassword.newPassword });
    if (validInputEmail.error) {
      setInputErrorList((prvState) => [...prvState, "newPassword"]);
      return;
    }
    if (resetPassword.newPassword !== resetPassword.repeatPassword) {
      setInputErrorList((prvState) => [...prvState, "repeatPassword"]);
      return;
    }
    const email = await readFromStorage<string>(STORAGE_KEY_EMAIL);
    const token = await readFromStorage<string>(STORAGE_KEY_TOKEN);
    if (email && token) {
      mutate({ email, token: Number(token), newPassword: resetPassword.newPassword });
    }
  };

  return (
    <SafeAreaView style={{ paddingTop: insets.top + 10, backgroundColor, flex: 1 }}>
      <ScrollView>
        <View style={styles.container}>
          <Loader visible={isPending} />
          <FormHeader title="Новый пароль" subTitle="Введите новый пароль" />
          <View style={styles.inputWrapper}>
            <FormInput
              label="Новый пароль"
              name="newPassword"
              onValueChange={handleOnTextInputChange}
              type="password"
              placeholder="Придумайте пароль"
              hasError={inputErrorList.includes("newPassword")}
            />
            <FormInput
              label="Подтвердите новый пароль"
              name="repeatPassword"
              onValueChange={handleOnTextInputChange}
              type="password"
              placeholder="Придумайте пароль"
              hasError={inputErrorList.includes("repeatPassword")}
            />
          </View>

          <CustomButton
            label="Создать новый пароль"
            style={styles.button}
            onPress={handleResetPassword}
          />
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
    gap: 32,
  },
  inputWrapper: {
    gap: 16,
  },
  button: {
    marginTop: 32,
  },
});
