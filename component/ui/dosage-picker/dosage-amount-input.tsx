import { getDosageMeasurement } from "@/helpers/getDosageMeasurement";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useFeedBackStore } from "@/stores/feedback-store";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { RefObject, useState } from "react";
import { Keyboard, StyleSheet, Text, View } from "react-native";
import BottomSheetWrapper, { BottomSheetWrapperRef } from "../bottom-sheet-wrapper";
import CustomButton from "../custom-button/custom-button";

type DosageAmountInputProps = {
  showInputRef: RefObject<BottomSheetWrapperRef | null>;
  measurementValue: string;
  onSetValue: (value: string) => void;
};

export default function DosageAmountInput({
  showInputRef,
  onSetValue,
  measurementValue,
}: DosageAmountInputProps) {
  const [value, setValue] = useState("");

  const { showFeedBack } = useFeedBackStore();
  const measurement = getDosageMeasurement(measurementValue);

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
    Keyboard.dismiss();
    showInputRef.current?.close();
  };

  // Themes color
  const color = useThemeColor({}, "textPrimary");
  const inputBgColor = useThemeColor({}, "backgroundSecondary");
  const inputBorderColor = useThemeColor({}, "borderColor");

  return (
    <BottomSheetWrapper ref={showInputRef} title="Количество дозировки" snapPointPercent="40%">
      <View style={styles.container}>
        <Text style={[styles.label, { color }]}>Доза за приём</Text>
        <View style={styles.innerWrapper}>
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
          <Text style={[styles.text, { color }]}>Введите общую сумму в «{measurement}»</Text>
        </View>

        <CustomButton
          label="Задать"
          onPress={handleSetDosageAmount}
          style={{ marginTop: "auto" }}
        />
      </View>
    </BottomSheetWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 230,
    gap: 16,
  },
  innerWrapper: {
    gap: 12,
  },
  label: {
    fontFamily: "Roboto_600SemiBold",
    fontSize: 18,
    lineHeight: 24,
  },
  text: {
    fontFamily: "Roboto_500Medium",
    fontSize: 15,
    lineHeight: 19,
  },
  input: {
    width: "100%",
    height: 55,
    borderWidth: 1,
    borderRadius: 16,
    fontFamily: "Roboto_600SemiBold",
    fontSize: 19,
    lineHeight: 24,
    paddingLeft: 16,
    paddingRight: 16,
  },
});
