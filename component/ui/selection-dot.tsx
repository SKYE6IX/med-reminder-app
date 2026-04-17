import { useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet, View } from "react-native";

export default function SelectionDot({ isActive }: { isActive: boolean }) {
  const tintColor = useThemeColor({}, "tint");

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isActive ? "#F7F7F7" : "#AEAEB2",
        },
      ]}
    >
      <View
        style={[
          styles.dot,
          {
            transform: [{ scale: isActive ? 0.8 : 1 }],
            backgroundColor: isActive ? tintColor : "#fff",
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 20,
    height: 20,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
  },
  dot: {
    width: 15,
    height: 15,
    borderRadius: 15,
  },
});
