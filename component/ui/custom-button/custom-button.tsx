import { useLinkButtonStyles } from "@/component/shared-styles/link-button-styles";
import { Image } from "expo-image";
import { Pressable, type PressableProps, Text } from "react-native";

type CustomButtonProps = PressableProps & {
  label: string;
  variant?: "filled" | "outline" | "disabled" | "danger";
  textVaraint?: "regularText" | "accentText" | "mutedText";
  logoSrc?: any;
};

export default function CustomButton({
  label,
  variant = "filled",
  textVaraint = "regularText",
  onPress,
  logoSrc,
}: CustomButtonProps) {
  const buttonStyles = useLinkButtonStyles();

  return (
    <Pressable
      role="button"
      onPress={onPress}
      style={[buttonStyles.base, buttonStyles[variant]]}
    >
      {logoSrc && <Image source={logoSrc} style={buttonStyles.logo} />}
      <Text style={[buttonStyles.text, buttonStyles[textVaraint]]}>
        {label}
      </Text>
    </Pressable>
  );
}
