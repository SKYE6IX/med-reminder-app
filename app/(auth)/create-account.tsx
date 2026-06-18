import FormHeader from "@/component/ui/form/form-header";
import FormInput from "@/component/ui/form/form-input";
import { Link } from "expo-router";
import { useRef, useState } from "react";
import { Platform, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/component/themed-text/themed-text";
import CustomButton from "@/component/ui/custom-button/custom-button";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAuthStore } from "@/stores/use-auth-store";
import { validateCreateAccountInputs } from "@/utils/validator";

import AppleSignIn from "@/component/ui/apple-sign-in";
import Loader from "@/component/ui/loader";
import { useFeedBackStore } from "@/stores/feedback-store";
import { AuthResponse } from "@/types/auth-response";
import { api, axios } from "@/utils/axiosInstance";
import { queryClient } from "@/utils/query-client";
import { clearTokens, saveTokens } from "@/utils/tokenUtils";
import { useMutation } from "@tanstack/react-query";

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
      clearTokens();
      saveTokens(data.accessToken, data.refreshToken);
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsAuthenticated(true);
    },
    onError(error) {
      if (axios.isAxiosError(error)) {
        showFeedBack({
          title: "Что-то пошло не так!",
          message: "Что-то пошло не так при создании учетной записи. Попробуйте еще раз!",
          status: "error",
        });
        console.log("An Axios error occur -> ", error);
      } else {
        console.log("An unknown error occur in create account mutation", error);
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
    <ScrollView contentContainerStyle={{ flex: 1, paddingTop: insets.top * 2, backgroundColor }}>
      <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <Loader visible={isPending} />

        <FormHeader title="Создать аккаунт" subTitle="Заполните Ваши данные" />

        <View style={styles.inputsWrapper}>
          <FormInput
            label="Имя"
            name="name"
            onValueChange={handleOnValueChanges}
            inputRef={textInputRef}
            type="text"
            placeholder="Введите Ваше имя"
            hasError={createAccountState.errorsSet.has("name")}
          />
          <FormInput
            label="Почта"
            name="email"
            onValueChange={handleOnValueChanges}
            inputRef={emaiInputRef}
            type="email"
            placeholder="Введите адрес Вашей почты"
            hasError={createAccountState.errorsSet.has("email")}
          />
          <FormInput
            label="Пароль"
            name="password"
            onValueChange={handleOnValueChanges}
            type="password"
            placeholder="Придумайте пароль"
            hasError={createAccountState.errorsSet.has("password")}
            textContentType="newPassword"
            autoComplete="new-password"
          />
        </View>

        <View style={styles.submitButtonWrapper}>
          <CustomButton label="Создать аккаунт" onPress={handleSubmitForm} disabled={isPending} />
          <ThemedText style={styles.termsText}>
            Создавая аккаунт, Вы принимаете
            <Link href="/" style={{ color: linkColor }}>
              {" "}
              Условия использования
            </Link>{" "}
            и
            <Link href="/" style={{ color: linkColor }}>
              {" "}
              Политику конфиденциальности.
            </Link>
          </ThemedText>
        </View>

        <View style={styles.socialButtonWrapper}>
          <View style={styles.dividerWrapper}>
            <View style={styles.divider} />
            <ThemedText style={styles.dividerText}>Или</ThemedText>
            <View style={styles.divider} />
          </View>

          {Platform.OS === "ios" && <AppleSignIn type="SIGN_UP" />}
        </View>

        <View style={styles.footerWrapper}>
          <ThemedText style={styles.footerText}>
            Уже есть аккаунт?{"  "}
            <Link href="/sign-in" style={{ color: linkColor }}>
              Войти
            </Link>
          </ThemedText>
        </View>
      </View>
    </ScrollView>
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
    alignItems: "center",
  },
  footerText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 12,
    lineHeight: 14.4,
  },
  footerLink: {
    fontFamily: "Roboto_500Medium",
  },
});
