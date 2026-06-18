import { Stack } from "expo-router";
import { ColorValue, StyleProp } from "react-native";

export default function AuthLayout() {
  const headerStyle: StyleProp<{
    backgroundColor: ColorValue;
    shadowColor: "transparent";
  }> = {
    shadowColor: "transparent",
    backgroundColor: "transparent",
  };

  return (
    <Stack>
      <Stack.Screen name="welcome">
        <Stack.Header style={headerStyle} />
        <Stack.Title></Stack.Title>
      </Stack.Screen>

      <Stack.Screen name="create-account">
        <Stack.Header style={headerStyle} />
        <Stack.Title></Stack.Title>
      </Stack.Screen>

      <Stack.Screen name="sign-in">
        <Stack.Header style={headerStyle} />
        <Stack.Title></Stack.Title>
      </Stack.Screen>

      <Stack.Screen name="forget-password/index">
        <Stack.Header style={headerStyle} />
        <Stack.Title></Stack.Title>
      </Stack.Screen>

      <Stack.Screen name="forget-password/otp">
        <Stack.Header style={headerStyle} />
        <Stack.Title></Stack.Title>
      </Stack.Screen>

      <Stack.Screen name="forget-password/new-password">
        <Stack.Header style={headerStyle} />
        <Stack.Title></Stack.Title>
      </Stack.Screen>
    </Stack>
  );
}
