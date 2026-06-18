import PhoneIcon from "@/component/icons/phone-icon";
import UserCloseIcon from "@/component/icons/user-close-icon";
import UserLockIcon from "@/component/icons/user-lock-icon";
import { BottomSheetWrapperRef } from "@/component/ui/bottom-sheet-wrapper";
import ChangePasswordSheet from "@/component/ui/settings/change-password-sheet";
import DeleteAccountSheet from "@/component/ui/settings/delete-account-sheet";
import SettingsCard from "@/component/ui/settings/settings-card";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAppSettingsStore } from "@/stores/app-settings-store";
import { useFeedBackStore } from "@/stores/feedback-store";
import * as LocalAuthentication from "expo-local-authentication";
import { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function Security() {
  const { useDeviceLock, setUseDeviceLock } = useAppSettingsStore();
  const { showFeedBack } = useFeedBackStore();
  const insets = useSafeAreaInsets();

  const changePasswordSheetRef = useRef<BottomSheetWrapperRef>(null);
  const deleteAccountSheetRef = useRef<BottomSheetWrapperRef>(null);

  const color = useThemeColor({}, "textPrimary");
  const bgPrimary = useThemeColor({}, "backgroundPrimary");

  const toggleuseDeviceLock = async (value: boolean) => {
    const isAvailable = await LocalAuthentication.hasHardwareAsync();
    if (!isAvailable) {
      showFeedBack({
        title: "не допускается",
        message: "Ваше устройство не поддерживает блокировку устройств.",
        status: "error",
      });
      return;
    }
    setUseDeviceLock(value);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgPrimary }]}>
      <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
        <SettingsCard
          title="Изменить пароль"
          description="Изменить пароль профиля пользователя"
          svgIcon={<UserLockIcon color={color} />}
          interaction="press"
          onPress={() => changePasswordSheetRef.current?.open()}
        />

        {/* Allow to use device lock */}
        <SettingsCard
          title="Блокировка приложения"
          description="Используйте биометрию устройства для входа"
          svgIcon={<PhoneIcon color={color} />}
          interaction="toggle"
          toggleValue={useDeviceLock}
          onToggle={toggleuseDeviceLock}
        />

        <SettingsCard
          title="Удалить мой аккаунт и данные"
          description="Безвозвратно удалить ваш аккаунт с лекарствами"
          svgIcon={<UserCloseIcon color={color} />}
          interaction="press"
          onPress={() => deleteAccountSheetRef.current?.open()}
        />
      </View>

      {/* Bottom Sheets */}
      <ChangePasswordSheet bottomSheetRef={changePasswordSheetRef} />
      <DeleteAccountSheet bottomSheetRef={deleteAccountSheetRef} />
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
