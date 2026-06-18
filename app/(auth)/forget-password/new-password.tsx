import CustomButton from "@/component/ui/custom-button/custom-button";
import FormHeader from "@/component/ui/form/form-header";
import FormInput from "@/component/ui/form/form-input";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Todo:
// 1. Cheeck to make sure backend email service is ready.
// 2. Set up the reset password
// 3. Handle Error and clear all neccessary details
// 4. Reset any data we stroe inside AsyncStorage and SecureStorage.

export default function NewPasswordScreen() {
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, "backgroundPrimary");

  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top * 2, backgroundColor }}>
      <View style={styles.container}>
        <FormHeader title="Новый пароль" subTitle="Введите новый пароль" />
        <View style={styles.inputWrapper}>
          <FormInput
            label="Новый пароль"
            name="password"
            onValueChange={() => {}}
            type="password"
            placeholder="Придумайте пароль"
            hasError={false}
          />
          <FormInput
            label="Подтвердите новый пароль"
            name="password"
            onValueChange={() => {}}
            type="password"
            placeholder="Придумайте пароль"
            hasError={false}
          />
        </View>

        <CustomButton label="Создать новый пароль" style={styles.button} />
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
  inputWrapper: {
    gap: 16,
  },
  button: {
    marginTop: 32,
  },
});
