import { useLinkButtonStyles } from "@/component/shared-styles/link-button-styles";
import { Image } from "expo-image";
import { Pressable, type PressableProps, Text } from "react-native";

type CustomButtonProps = PressableProps & {
  label: string;
  variant?: "filled" | "outline" | "disabled" | "danger";
  textVaraint?: "regularText" | "accentText" | "mutedText" | "tintText";
  logoSrc?: any;
  svgIcon?: React.ReactNode;
};

export default function CustomButton({
  style,
  label,
  variant = "filled",
  textVaraint = "regularText",
  onPress,
  logoSrc,
  svgIcon,
  ...rest
}: CustomButtonProps) {
  const buttonStyles = useLinkButtonStyles();

  return (
    <Pressable
      role="button"
      onPress={onPress}
      // @ts-ignore the style showned type error
      style={[buttonStyles.base, buttonStyles[variant], style]}
      {...rest}
    >
      {logoSrc && <Image source={logoSrc} style={buttonStyles.logo} />}
      {svgIcon && svgIcon}
      <Text style={[buttonStyles.text, buttonStyles[textVaraint]]}>{label}</Text>
    </Pressable>
  );
}
