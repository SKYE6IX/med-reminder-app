import FormHeader from "@/component/ui/form/form-header";
import FormInput from "@/component/ui/form/form-input";
import { Link } from "expo-router";
import React, { useRef, useState } from "react";
import { Platform, StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/component/themed-text/themed-text";
import CustomButton from "@/component/ui/custom-button/custom-button";
import Loader from "@/component/ui/loader";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useFeedBackStore } from "@/stores/feedback-store";
import { useAuthStore } from "@/stores/use-auth-store";
import { AuthResponse } from "@/types/auth-response";
import { api, axios } from "@/utils/axiosInstance";
import { queryClient } from "@/utils/query-client";
import { clearTokens, saveTokens } from "@/utils/tokenUtils";
import { validateSignInInputs } from "@/utils/validator";
import { useMutation } from "@tanstack/react-query";

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
  const { showFeedBack } = useFeedBackStore();
  const { setIsAuthenticated } = useAuthStore();
  const [signInState, setSignInState] = useState<SignInState>({
    formState: {
      email: "",
      password: "",
    },
    errorsSet: new Set(),
  });

  const scheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const emaiInputRef = useRef<TextInput>(null);

  const appleLogoSource =
    scheme === "dark"
      ? require("@/assets/icons/apple-logo-light.png")
      : require("@/assets/icons/apple-logo.png");

  const googleLogoSource = require("@/assets/icons/google-logo.png");

  const linkColor = useThemeColor({}, "buttonPrimaryBg");

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
      clearTokens();
      saveTokens(data.accessToken, data.refreshToken);
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsAuthenticated(true);
    },
    onError(error) {
      if (axios.isAxiosError(error)) {
        error.response?.status === 401 &&
          showFeedBack({
            title: "Не удалось авторизовать!",
            message: "Неверный адрес электронной почты или пароль!",
            status: "error",
          });
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
    <View style={[{ paddingBottom: Math.max(insets.bottom, 30) }, styles.container]}>
      <Loader visible={isPending} />

      <FormHeader title="Войти" subTitle="Введите данные для входа в аккаунт" />
      <View style={styles.inputsWrapper}>
        <FormInput
          label="Почта"
          name="email"
          onValueChange={handleOnValueChanges}
          inputRef={emaiInputRef}
          type="email"
          placeholder="Введите адрес Вашей почты"
          hasError={signInState.errorsSet.has("email")}
        />
        <FormInput
          label="Пароль"
          name="password"
          onValueChange={handleOnValueChanges}
          type="password"
          placeholder="Придумайте пароль"
          hasError={signInState.errorsSet.has("password")}
          textContentType="password"
          autoComplete="password"
        />
      </View>

      <View style={styles.submitButtonWrapper}>
        <CustomButton label="Войти" onPress={handleSubmitForm} disabled={isPending} />
        <ThemedText style={styles.resetPasswordText}>
          Забыли пароль?
          <Link href="/forget-password" style={{ color: linkColor }}>
            {" "}
            Нажмите здесь
          </Link>
        </ThemedText>
      </View>

      <View style={styles.socialButtonWrapper}>
        <View style={styles.dividerWrapper}>
          <View style={styles.divider} />
          <ThemedText style={styles.dividerText}>Или</ThemedText>
          <View style={styles.divider} />
        </View>

        {Platform.OS === "ios" && (
          <CustomButton
            label="Вход с аккаунтом Apple"
            logoSrc={appleLogoSource}
            variant="outline"
            textVaraint="accentText"
          />
        )}
        <CustomButton
          label="Вход с аккаунтом Google"
          logoSrc={googleLogoSource}
          variant="outline"
          textVaraint="accentText"
        />
      </View>

      <View style={styles.footerWrapper}>
        <ThemedText style={styles.footerText}>
          Нет аккаунта?{"  "}
          <Link href="/create-account" style={{ color: linkColor }}>
            Создать аккаунт
          </Link>
        </ThemedText>
      </View>
    </View>
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
  resetPasswordText: {
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
