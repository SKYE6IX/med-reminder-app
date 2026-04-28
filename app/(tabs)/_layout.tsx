import { Colors } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { DynamicColorIOS, Platform } from "react-native";

export default function TabLayout() {
  const isIOS = Platform.OS === "ios";

  const color = useThemeColor({}, "textPrimary");
  const tintColor = useThemeColor({}, "tint");
  const bgColor = useThemeColor({}, "backgroundPrimary");

  return (
    <NativeTabs
      labelStyle={{
        default: {
          color: isIOS
            ? DynamicColorIOS({
                dark: "#ECEDEE",
                light: "#353535",
              })
            : color,
        },
        selected: {
          color: isIOS
            ? DynamicColorIOS({
                dark: Colors["dark"].tint,
                light: Colors["light"].tint,
              })
            : tintColor,
        },
      }}
      tintColor={
        isIOS
          ? DynamicColorIOS({
              dark: Colors["dark"].tint,
              light: Colors["light"].tint,
            })
          : tintColor
      }
      labelVisibilityMode="labeled"
      backgroundColor={bgColor}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Главная</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="medications">
        <NativeTabs.Trigger.Label>Лекарства</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="pill" md="pill" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="add-medication">
        <NativeTabs.Trigger.Label>Добавить</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="plus.app" md="add_box" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="refill-medications">
        <NativeTabs.Trigger.Label>Запасы</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="plus.arrow.trianglehead.clockwise" md="refresh" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>Настройки</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="gear" md="settings" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
