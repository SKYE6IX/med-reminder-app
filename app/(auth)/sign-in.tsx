import FormHeader from "@/component/ui/form-header";
import FormInput from "@/component/ui/form-input/form-input";
import { Link } from "expo-router";
import React, { useRef } from "react";
import { Platform, StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/component/themed-text/themed-text";
import CustomButton from "@/component/ui/custom-button/custom-button";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function SignInScreen() {
  const scheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const emaiInputRef = useRef<TextInput>(null);

  const appleLogoSource =
    scheme === "dark"
      ? require("@/assets/icons/apple-logo-light.png")
      : require("@/assets/icons/apple-logo.png");

  const googleLogoSource = require("@/assets/icons/google-logo.png");

  const linkColor = useThemeColor({}, "buttonPrimaryBg");
  return (
    <View
      style={[{ paddingBottom: Math.max(insets.bottom, 30) }, styles.container]}
    >
      <FormHeader title="Войти" subTitle="Введите данные для входа в аккаунт" />
      <View style={styles.inputsWrapper}>
        <FormInput
          label="Почта"
          name="email"
          onValueChange={() => {}}
          inputRef={emaiInputRef}
          type="email"
          placeholder="Введите адрес Вашей почты"
          hasError={false}
        />
        <FormInput
          label="Пароль"
          name="password"
          onValueChange={() => {}}
          type="password"
          placeholder="Придумайте пароль"
          hasError={false}
        />
      </View>

      <View style={styles.submitButtonWrapper}>
        <CustomButton label="Войти" />
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
