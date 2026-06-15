import CustomButton from "@/component/ui/custom-button/custom-button";
import FormHeader from "@/component/ui/form/form-header";
import FormInput from "@/component/ui/form/form-input";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NewPasswordScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView>
      <View style={[{ paddingBottom: insets.bottom }, styles.container]}>
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
