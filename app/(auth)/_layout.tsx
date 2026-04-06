import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerTitle: "",
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="create-account" />
      <Stack.Screen name="sign-in" />
    </Stack>
  );
}
