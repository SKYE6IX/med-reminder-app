import { Tabs } from "expo-router";

import { HapticTab } from "@/component/haptic-tab";
import GearIcon from "@/component/icons/gear-icon";
import HomeIcon from "@/component/icons/home-icon";
import PillIcon from "@/component/icons/pill-icon";
import RotatePlusIcon from "@/component/icons/pill-rotate-icon";
import PlusSquareIcon from "@/component/icons/plus-square-icon";
import { useColorScheme } from "@/hooks/use-color-scheme";

import { Colors } from "@/constants/theme";

export default function AppTab() {
  const colorScheme = useColorScheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme ?? "light"].backgroundPrimary,
        },
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Главная",
          tabBarIcon: ({ color, size }) => (
            <HomeIcon size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pills"
        options={{
          title: "Лекарства",
          tabBarIcon: ({ color, size }) => (
            <PillIcon size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add-pill"
        options={{
          title: "Добавить",
          tabBarIcon: ({ color, size }) => (
            <PlusSquareIcon size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="refill-pill"
        options={{
          title: "Запасы",
          tabBarIcon: ({ color, size }) => (
            <RotatePlusIcon size={32} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Настройки",
          tabBarIcon: ({ color, size }) => (
            <GearIcon size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
