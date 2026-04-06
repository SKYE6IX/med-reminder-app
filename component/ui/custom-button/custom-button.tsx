import { linkButtonStyles } from "@/component/shared-styles/link-button-styles";
import { Pressable, Text, type PressableProps } from "react-native";

type CustomButtonProps = PressableProps & {
  label: string;
  variant?: "primary" | "secondary" | "outline";
};

export default function CustomButton({
  label,
  variant = "primary",
  onPress,
}: CustomButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={() => [linkButtonStyles.base, linkButtonStyles[variant]]}
    >
      <Text>{label}</Text>
    </Pressable>
  );
}
