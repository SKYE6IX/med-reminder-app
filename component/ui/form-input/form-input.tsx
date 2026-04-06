import React, { type Ref, useState } from "react";
import { StyleSheet, TextInput, type TextInputProps } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/component/themed-text/themed-text";

type FormInputProps = TextInputProps & {
  customRef?: Ref<TextInput>;
  label: string;
  type?: "text" | "email" | "password";
  onValueChange: (value: string) => void;
};

export default function FormInput({
  label,
  customRef,
  onValueChange,
  ...rest
}: FormInputProps) {
  const [inputValue, onInputValueChange] = useState("");

  const handleOnTextChange = (text: string) => {
    onInputValueChange(text);
    onValueChange(text);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <ThemedText>{label}</ThemedText>
        <TextInput
          ref={customRef}
          onChangeText={handleOnTextChange}
          value={inputValue}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({});
