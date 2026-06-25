import { getDosageMeasurement } from "@/helpers/getDosageMeasurement";
import { useThemeColor } from "@/hooks/use-theme-color";
import React, { useState } from "react";
import { Platform, StyleSheet, Text, TextInput, View } from "react-native";
import CustomPicker from "./custom-picker/custom-picker";

const REMINDER_DAYS = Array.from({ length: 7 }, (_, i) => ({
  label: `${1 + i}`,
  value: `${1 + i}`,
}));

type MedicationPackPickerProps = {
  amountInPack: string;
  refillDaysReminder: string;
  onAmountInPackSet: (value: string) => void;
  onRefillDaysReminderSet: (value: string) => void;
  measurementValue: string;

  // @platform IOS ONLY!!!
  // This callback funtion is used in "final step screen" on add-medication page.
  // Used to track when to expand the height
  //  of the box where the picker is placed.
  onPickerTrigger?: (isPicker: boolean) => void;
};

export default function MedicationPackPicker({
  amountInPack,
  refillDaysReminder,
  onAmountInPackSet,
  onRefillDaysReminderSet,
  onPickerTrigger,
  measurementValue,
}: MedicationPackPickerProps) {
  const isIOS = Platform.OS === "ios";

  const measurement = getDosageMeasurement(measurementValue);

  const [localValue, setLocalValue] = useState({
    amountInPack,
    refillDaysReminder,
  });

  // @platform IOS ONLY
  const [isRefillDaysPickerVisible, setIsRefillDaysPickerVisible] = useState(false);

  // @platform IOS ONLY
  const triggerRefillDaysPicker = () => {
    if (isIOS) {
      const isOpen = !isRefillDaysPickerVisible;
      onPickerTrigger && onPickerTrigger(isOpen);
      setIsRefillDaysPickerVisible(isOpen);
    }
    if (!localValue.refillDaysReminder) {
      setLocalValue((prv) => ({ ...prv, refillDaysReminder: REMINDER_DAYS[0].value }));
      onRefillDaysReminderSet(REMINDER_DAYS[0].value);
    }
  };

  const handleOnTextChange = (value: string) => {
    const normalized = value.replace(",", ".");
    onAmountInPackSet(normalized);
    setLocalValue((prv) => ({ ...prv, amountInPack: normalized }));
  };

  const handleRefillDaysSet = (selectedValue: string) => {
    onRefillDaysReminderSet(selectedValue);
    setLocalValue((prv) => ({ ...prv, refillDaysReminder: selectedValue }));
  };

  //   Theme color
  const color = useThemeColor({}, "textPrimary");
  const bgColor = useThemeColor({}, "backgroundSecondary");
  const inputBorderColor = useThemeColor({}, "borderColor");

  return (
    <React.Fragment>
      <View style={styles.packAmountContainer}>
        <Text style={[styles.bottomSheetlabel, { color }]}>Общее количество дозы.</Text>
        <TextInput
          style={[
            styles.bottomSheetInput,
            {
              backgroundColor: bgColor,
              borderColor: inputBorderColor,
              color,
            },
          ]}
          keyboardType="decimal-pad"
          inputMode="decimal"
          returnKeyType="done"
          maxLength={10}
          value={amountInPack}
          onChangeText={handleOnTextChange}
        />
        <Text style={[styles.bottomSheetText, { color }]}>
          Введите общую сумму в «{measurement}»
        </Text>
      </View>

      <CustomPicker
        label="Напомнить за срок (дни)"
        items={REMINDER_DAYS}
        selectedValue={localValue.refillDaysReminder}
        onValueSelected={handleRefillDaysSet}
        isSelectionVisible={isRefillDaysPickerVisible} // IOS ONLY
        triggerSelection={triggerRefillDaysPicker} // IOS ONLY
      />
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  packAmountContainer: {
    gap: 8,
  },
  packAmountLabel: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    lineHeight: 19.2,
  },
  packAmountPressable: {
    minWidth: 80,
    padding: 7,
    borderRadius: 16,
  },
  packAmountText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
    lineHeight: 16.2,
    textAlign: "center",
  },
  bottomSheetlabel: {
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
    lineHeight: 19.2,
    paddingLeft: 8,
  },
  bottomSheetText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    lineHeight: 16,
    paddingLeft: 12,
  },
  bottomSheetInput: {
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
