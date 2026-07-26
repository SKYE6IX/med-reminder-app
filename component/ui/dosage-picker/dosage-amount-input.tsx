import { getDosageMeasurement } from "@/helpers/getDosageMeasurement";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useTranslation } from "@/i18next/i18next";
import { useFeedBackStore } from "@/stores/feedback-store";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useState } from "react";
import { Keyboard, StyleSheet, Text, View } from "react-native";
import CustomButton from "../custom-button/custom-button";

type DosageAmountInputProps = {
  measurementValue: string;
  onSetValue: (value: string) => void;
  closeSheet: () => void;
};

export default function DosageAmountInput({
  onSetValue,
  measurementValue,
  closeSheet,
}: DosageAmountInputProps) {
  const { t } = useTranslation();
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
        title: t("feedback.error.dosage_amount.title"),
        message: t("feedback.error.dosage_amount.text"),
        status: "error",
      });
      return;
    }
    onSetValue(value);
    Keyboard.dismiss();
    closeSheet();
  };

  // Themes color
  const color = useThemeColor({}, "textPrimary");
  const inputBgColor = useThemeColor({}, "backgroundSecondary");
  const inputBorderColor = useThemeColor({}, "borderColor");

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color }]}>{t("common.dose_amount_picker_heading")}</Text>
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
        <Text style={[styles.text, { color }]}>
          {t("common.dose_amount_picker_description", { measurement: measurement ?? "" })}
        </Text>
      </View>
      <CustomButton
        label={t("common.apply")}
        onPress={handleSetDosageAmount}
        style={{ marginTop: "auto" }}
      />
    </View>
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
