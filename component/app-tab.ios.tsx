import { Colors } from "@/constants/theme";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { DynamicColorIOS } from "react-native";

// TODO:
// Default color selection isn't working yet and need fix.
// The whole Native tabs is still unstable and need to make sure we adjust to it and fix
// any bugs that might occurs along the way.
export default function AppTab() {
  return (
    <NativeTabs
      labelStyle={{
        default: {
          color: DynamicColorIOS({
            dark: "#6B6B6B",
            light: "#6B6B6B",
          }),
        },
        selected: {
          color: DynamicColorIOS({
            dark: Colors["dark"].tint,
            light: Colors["light"].tint,
          }),
        },
      }}
      tintColor={DynamicColorIOS({
        dark: Colors["dark"].tint,
        light: Colors["light"].tint,
      })}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Главная</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="pills">
        <NativeTabs.Trigger.Label>Лекарства</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="pill" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="add-pill" disableAutomaticContentInsets>
        <NativeTabs.Trigger.Label>Добавить</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="plus.app" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="refill-pill">
        <NativeTabs.Trigger.Label>Запасы</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="plus.arrow.trianglehead.clockwise" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>Настройки</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="gear" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
