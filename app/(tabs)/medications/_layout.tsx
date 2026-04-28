import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function PillsLayout() {
  return (
    <Stack screenOptions={{ headerTitle: "" }}>
      <Stack.Header transparent style={{ shadowColor: "transparent" }} />
    </Stack>
  );
}
