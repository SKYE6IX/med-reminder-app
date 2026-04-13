import FormHeader from "@/component/ui/form-header";
import FormInput from "@/component/ui/form-input/form-input";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CustomButton from "@/component/ui/custom-button/custom-button";

export default function ForgetPasswordScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  return (
    <View style={[{ paddingBottom: insets.bottom }, styles.container]}>
      <FormHeader
        title="Забыли пароль?"
        subTitle="Введите данные для восстановления аккаунта"
      />
      <FormInput
        label="Почта"
        onValueChange={() => {}}
        type="email"
        name="email"
        placeholder="Введите Вашу почту"
        hasError={false}
      />
      <CustomButton
        label="Восстановить пароль"
        onPress={() => router.navigate("/forget-password/otp")}
      />
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
});
