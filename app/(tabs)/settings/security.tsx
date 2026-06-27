import { useBottomSheet } from "@/component/bottom-sheet-provider";
import PhoneIcon from "@/component/icons/phone-icon";
import UserCloseIcon from "@/component/icons/user-close-icon";
import UserLockIcon from "@/component/icons/user-lock-icon";
import ChangePassword from "@/component/ui/settings/change-password";
import DeleteAccount from "@/component/ui/settings/delete-account";
import SettingsCard from "@/component/ui/settings/settings-card";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAppSettingsStore } from "@/stores/app-settings-store";
import { useFeedBackStore } from "@/stores/feedback-store";
import * as LocalAuthentication from "expo-local-authentication";
import { Platform, StyleSheet, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function Security() {
  const isAdnroid = Platform.OS === "android";
  const { openSheet, closeSheet } = useBottomSheet();

  const { useDeviceLock, setUseDeviceLock } = useAppSettingsStore();
  const { showFeedBack } = useFeedBackStore();
  const insets = useSafeAreaInsets();

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

  const showChangePasswordSheet = () => {
    openSheet({
      title: "Изменить пароль",
      content: <ChangePassword />,
    });
  };

  const snapPoint = isAdnroid ? "35%" : "30%";
  const showDeleteAccountSheet = () => {
    openSheet({
      title: "Удалить аккаунт?",
      snapPointPercent: snapPoint,
      content: <DeleteAccount closeSheet={closeSheet} />,
    });
  };

  const top = isAdnroid ? insets.top + 20 : insets.top + 10;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgPrimary, paddingTop: top }}>
      <View style={styles.container}>
        <SettingsCard
          title="Изменить пароль"
          description="Изменить пароль профиля пользователя"
          svgIcon={<UserLockIcon color={color} />}
          interaction="press"
          onPress={showChangePasswordSheet}
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
          onPress={showDeleteAccountSheet}
        />
      </View>
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
