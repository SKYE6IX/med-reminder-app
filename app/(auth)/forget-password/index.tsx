import FormHeader from "@/component/ui/form/form-header";
import FormInput from "@/component/ui/form/form-input";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import CustomButton from "@/component/ui/custom-button/custom-button";
import Loader from "@/component/ui/loader";
import { saveToStorage } from "@/helpers/storage-manager";
import { useRequestResetPasswordToken } from "@/hooks/use-request-reset-password-token";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useTranslation } from "@/i18next/i18next";
import { validateResetPasswordInputs } from "@/utils/validator";
import { useState } from "react";

const STORAGE_KEY_EMAIL = "password:reset:email";

export default function ForgetPasswordScreen() {
  const { t } = useTranslation();
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
    <SafeAreaView style={{ paddingTop: insets.top + 10, backgroundColor, flex: 1 }}>
      <ScrollView>
        <Loader visible={isPending} />
        <View style={[{ paddingBottom: insets.bottom }, styles.container]}>
          <FormHeader
            title={t("forget_passowrd_screen.step1.title")}
            subTitle={t("forget_passowrd_screen.step1.text")}
          />
          <FormInput
            label={t("common.form.email_label")}
            onValueChange={({ value }) => {
              setEmail(value);
              setShowError(false);
            }}
            type="email"
            name="email"
            placeholder={t("common.form.email_placeholder")}
            hasError={showError}
          />
          <CustomButton
            label={t("forget_passowrd_screen.step1.recover")}
            onPress={handleContinueToOTP}
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
});
