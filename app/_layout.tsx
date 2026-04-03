import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Protected guard={true}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>

      <Stack.Protected guard={false}>
        <Stack.Screen name="(authentication)" />
      </Stack.Protected>
    </Stack>
  );
}
