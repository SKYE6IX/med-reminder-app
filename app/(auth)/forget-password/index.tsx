import FormHeader from "@/component/ui/form/form-header";
import FormInput from "@/component/ui/form/form-input";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CustomButton from "@/component/ui/custom-button/custom-button";
import Loader from "@/component/ui/loader";
import { saveToStorage } from "@/helpers/storage-manager";
import { useRequestResetPasswordToken } from "@/hooks/use-request-reset-password-token";
import { useThemeColor } from "@/hooks/use-theme-color";
import { validateResetPasswordInputs } from "@/utils/validator";
import { useState } from "react";

const STORAGE_KEY_EMAIL = "password:reset:email";

export default function ForgetPasswordScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [showError, setShowError] = useState(false);

  const { requestResetPasswordToken, isPending } = useRequestResetPasswordToken({
    onSuccessAction() {
      handleOnTokenSent();
    },
  });

  const handleOnTokenSent = async () => {
    await saveToStorage(STORAGE_KEY_EMAIL, email);
    router.navigate("/forget-password/otp");
    setEmail("");
  };

  const handleContinueToOTP = async () => {
    const validInputEmail = validateResetPasswordInputs({ email });
    if (validInputEmail.error) {
      setShowError(true);
      return;
    }
    requestResetPasswordToken({ email });
  };

  // Themes
  const backgroundColor = useThemeColor({}, "backgroundPrimary");
  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top * 2, backgroundColor }}>
      <Loader visible={isPending} />
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
