import { useThemeColor } from "@/hooks/use-theme-color";
import { Stack } from "expo-router";

export default function AuthLayout() {
  const backgroundColor = useThemeColor({}, "backgroundPrimary");

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor,
        },
        headerShadowVisible: false,
        headerTitle: "",
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen name="welcome" />

      <Stack.Screen name="create-account" options={{ contentStyle: { backgroundColor } }} />

      <Stack.Screen name="sign-in" options={{ contentStyle: { backgroundColor } }} />

      <Stack.Screen name="forget-password/index" options={{ contentStyle: { backgroundColor } }} />

      <Stack.Screen name="forget-password/otp" options={{ contentStyle: { backgroundColor } }} />

      <Stack.Screen
        name="forget-password/new-password"
        options={{ contentStyle: { backgroundColor } }}
      />
    </Stack>
  );
}
