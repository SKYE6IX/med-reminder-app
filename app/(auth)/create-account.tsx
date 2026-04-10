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

export default function CreateAccountScreen() {
  const insets = useSafeAreaInsets();
  const textInputRef = useRef<TextInput>(null);
  const emaiInputRef = useRef<TextInput>(null);
  const scheme = useColorScheme();

  const appleLogoSource =
    scheme === "dark"
      ? require("@/assets/icons/apple-logo-light.png")
      : require("@/assets/icons/apple-logo.png");

  const googleLogoSource = require("@/assets/icons/google-logo.png");

  const linkColor = useThemeColor({}, "buttonPrimaryBg");
  return (
    <View
      style={[{ paddingBottom: Math.max(insets.bottom, 20) }, styles.container]}
    >
      <FormHeader title="Создать аккаунт" subTitle="Заполните Ваши данные" />

      <View style={styles.inputsWrapper}>
        <FormInput
          label="Имя"
          onValueChange={() => {}}
          inputRef={textInputRef}
          type="text"
          placeholder="Введите Ваше имя"
          hasError={false}
        />
        <FormInput
          label="Почта"
          onValueChange={() => {}}
          inputRef={emaiInputRef}
          type="email"
          placeholder="Введите адрес Вашей почты"
          hasError={false}
        />
        <FormInput
          label="Пароль"
          onValueChange={() => {}}
          type="password"
          placeholder="Придумайте пароль"
          hasError={false}
        />
      </View>

      <View style={styles.submitButtonWrapper}>
        <CustomButton label="Создать аккаунт" />
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
          Уже есть аккаунт?{"  "}
          <Link href="/sign-in" style={{ color: linkColor }}>
            Войти
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
