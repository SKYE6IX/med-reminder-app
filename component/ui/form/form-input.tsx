import { useState, type RefObject } from "react";
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from "react-native";

import CloseIcon from "@/component/icons/close-icon";
import ExclamationCircleIcon from "@/component/icons/exclamation-circle-icon";
import EyeIcon from "@/component/icons/eye-icon";
import StrokeEyeIcon from "@/component/icons/stroke-eye-icon";

import { ThemedText } from "@/component/themed-text/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { inputProps } from "./inputProps";

type FormInputProps = TextInputProps & {
  inputRef?: RefObject<TextInput | null>;
  name: string;
  label?: string;
  type?: "text" | "email" | "password";
  hasError: boolean;
  defaultState?: string;
  showLabel?: boolean;
  onValueChange: ({ name, value }: { name: string; value: string }) => void;
};

export default function FormInput({
  type = "text",
  label,
  inputRef,
  defaultState,
  onValueChange,
  hasError,
  name,
  showLabel = true,
  ...rest
}: FormInputProps) {
  const [inputValue, onInputValueChange] = useState(defaultState ?? "");
  const [hidePassword, setHidePassword] = useState(false);

  const isPassword = type === "password";

  const handleOnTextChange = (text: string) => {
    onInputValueChange(text);
    onValueChange({ name, value: text });
  };

  const clearInputValue = () => {
    onInputValueChange("");
    onValueChange({ name, value: "" });
  };

  const handleShowPassword = () => {
    setHidePassword(!hidePassword);
  };

  const inputBgColor = useThemeColor({}, "backgroundSecondary");
  const inputBorderColor = useThemeColor({}, "borderColor");
  const color = useThemeColor({}, "textPrimary");
  const mutedColor = useThemeColor({}, "textMuted");
  return (
    <View style={styles.container}>
      {showLabel && <ThemedText type="label">{label}</ThemedText>}
      <View style={styles.inputWrapper}>
        <TextInput
          ref={inputRef}
          onChangeText={handleOnTextChange}
          value={inputValue}
          style={[
            {
              backgroundColor: inputBgColor,
              borderColor: inputBorderColor,
              color,
            },
            styles.input,
            // inputRef?.current?.isFocused() ? styles.inputFocus : undefined,
            hasError ? styles.error : undefined,
          ]}
          placeholderTextColor={mutedColor}
          secureTextEntry={type === "password" && !hidePassword}
          clearTextOnFocus={false}
          testID="form-test-input"
          {...inputProps[type]}
          {...rest}
        />
        <View style={styles.iconWrapper}>
          {hasError ? (
            <ExclamationCircleIcon />
          ) : (
            <>
              {!isPassword && inputValue && (
                <Pressable onPress={clearInputValue} role="button">
                  <CloseIcon size={25} color={color} />
                </Pressable>
              )}

              {isPassword && (
                <>
                  {hidePassword ? (
                    <Pressable onPress={handleShowPassword}>
                      <StrokeEyeIcon size={25} color={color} />
                    </Pressable>
                  ) : (
                    <Pressable onPress={handleShowPassword}>
                      <EyeIcon width={25} height={18} color={color} />
                    </Pressable>
                  )}
                </>
              )}
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 8,
  },
  inputWrapper: {
    height: 48,
    width: "100%",
    position: "relative",
  },
  input: {
    height: "100%",
    borderWidth: 1,
    borderRadius: 16,
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    paddingLeft: 16,
    paddingRight: 41,
    lineHeight: 16.8,
  },
  inputFocus: {
    borderColor: "#353535",
  },
  iconWrapper: {
    position: "absolute",
    right: 16,
    height: 48,
    justifyContent: "center",
  },
  error: {
    borderColor: "#DC0000",
  },
});
