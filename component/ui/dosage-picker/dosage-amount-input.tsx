import { useThemeColor } from "@/hooks/use-theme-color";
import { useFeedBackStore } from "@/stores/feedback-store";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { RefObject, useState } from "react";
import { Keyboard, StyleSheet, Text, View } from "react-native";
import BottomSheetWrapper, { BottomSheetWrapperRef } from "../bottom-sheet-wrapper";
import CustomButton from "../custom-button/custom-button";

type DosageAmountInputProps = {
  showInputRef: RefObject<BottomSheetWrapperRef | null>;
  onSetValue: (value: string) => void;
};

export default function DosageAmountInput({ showInputRef, onSetValue }: DosageAmountInputProps) {
  const [value, setValue] = useState("");
  const { showFeedBack } = useFeedBackStore();

  const handleOnChangeText = (text: string) => {
    const normalized = text.replace(",", ".");
    setValue(normalized);
  };

  const handleSetDosageAmount = () => {
    if (Number(value) <= 0) {
      showFeedBack({
        title: "Неправильная дозировка",
        message: "Пожалуйста, установите допустимую дозировку.",
        status: "error",
      });
      return;
    }
    onSetValue(value);
    showInputRef.current?.close();
    Keyboard.dismiss();
  };

  // Themes color
  const inputBgColor = useThemeColor({}, "backgroundSecondary");
  const inputBorderColor = useThemeColor({}, "borderColor");
  const color = useThemeColor({}, "textPrimary");
  return (
    <BottomSheetWrapper ref={showInputRef} title="Количество дозировки" snapPointPercent="50%">
      <View style={styles.container}>
        <View style={{ gap: 16 }}>
          <Text style={[styles.label, { color }]}>Доза за приём</Text>
          <BottomSheetTextInput
            style={[
              styles.input,
              {
                backgroundColor: inputBgColor,
                borderColor: inputBorderColor,
                color,
              },
            ]}
            keyboardType="decimal-pad"
            inputMode="decimal"
            returnKeyType="done"
            maxLength={10}
            value={value}
            onChangeText={handleOnChangeText}
          />
        </View>
        <CustomButton label="Задать" onPress={handleSetDosageAmount} />
      </View>
    </BottomSheetWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    height: 300,
  },
  label: {
    fontFamily: "Roboto_600SemiBold",
    fontSize: 18,
    lineHeight: 24,
  },
  input: {
    width: "100%",
    height: 55,
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 16,
    fontFamily: "Roboto_600SemiBold",
    fontSize: 19,
    paddingLeft: 16,
    paddingRight: 16,
  },
});
