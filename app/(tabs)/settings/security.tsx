import PhoneIcon from "@/component/icons/phone-icon";
import UserCloseIcon from "@/component/icons/user-close-icon";
import UserLockIcon from "@/component/icons/user-lock-icon";
import { BottomSheetWrapperRef } from "@/component/ui/bottom-sheet-wrapper";
import ChangePasswordSheet from "@/component/ui/settings/change-password-sheet";
import SettingsCard from "@/component/ui/settings/settings-card";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useRef } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function Security() {
  const isIOS = Platform.OS === "ios";
  const insets = useSafeAreaInsets();

  const changePasswordSheetRef = useRef<BottomSheetWrapperRef>(null);

  const color = useThemeColor({}, "textPrimary");
  const bgPrimary = useThemeColor({}, "backgroundPrimary");

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgPrimary }]}>
      <View style={[styles.container, { paddingTop: isIOS ? insets.top : insets.top + 10 }]}>
        <SettingsCard
          title="Изменить пароль"
          description="Изменить пароль профиля пользователя"
          svgIcon={<UserLockIcon color={color} />}
          interaction="press"
          onPress={() => changePasswordSheetRef.current?.open()}
        />

        <SettingsCard
          title="Блокировка приложения"
          description="Используйте биометрию устройства для входа"
          svgIcon={<PhoneIcon color={color} />}
          interaction="toggle"
        />

        <SettingsCard
          title="Удалить мой аккаунт и данные"
          description="Безвозвратно удалить ваш аккаунт с лекарствами."
          svgIcon={<UserCloseIcon color={color} />}
          interaction="press"
        />
      </View>

      {/* Bottom Sheets */}
      <ChangePasswordSheet bottomSheetRef={changePasswordSheetRef} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingLeft: 20,
    paddingRight: 20,
    gap: 16,
  },
});
