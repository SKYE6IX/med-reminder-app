import { getDosageMeasurement } from "@/helpers/getDosageMeasurement";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useFeedBackStore } from "@/stores/feedback-store";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import React, { useRef, useState } from "react";
import { Keyboard, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import BottomSheetWrapper, { BottomSheetWrapperRef } from "./bottom-sheet-wrapper";
import CustomButton from "./custom-button/custom-button";
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
  dosageAmount: string;
  measurementValue: string;
  // @platform IOS ONLY!!!
  // This callback funtion is used in "final step screen" on add-medication page.
  // Used to expand the height of the box where the picker is placed.
  onPickerTrigger?: (isPicker: boolean) => void;
};

export default function MedicationPackPicker({
  amountInPack,
  refillDaysReminder,
  onAmountInPackSet,
  onRefillDaysReminderSet,
  onPickerTrigger,
  dosageAmount,
  measurementValue,
}: MedicationPackPickerProps) {
  const isIOS = Platform.OS === "ios";
  const bottomSheetRef = useRef<BottomSheetWrapperRef>(null);

  const { showFeedBack } = useFeedBackStore();

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
    setLocalValue((prv) => ({ ...prv, amountInPack: normalized }));
  };

  const handleRefillDaysSet = (selectedValue: string) => {
    onRefillDaysReminderSet(selectedValue);
    setLocalValue((prv) => ({ ...prv, refillDaysReminder: selectedValue }));
  };

  const handleSetAmountInPack = () => {
    if (Number(localValue.amountInPack) <= Number(dosageAmount)) {
      showFeedBack({
        title: "Неверный ввод",
        message: "Пожалуйста, введите количество, превышающее рекомендованную суточную дозу.",
        status: "error",
      });
      return;
    }
    Keyboard.dismiss();
    onAmountInPackSet(localValue.amountInPack);
    bottomSheetRef.current?.close();
  };

  //   Theme color
  const color = useThemeColor({}, "textPrimary");
  const bGColorTertiary = useThemeColor({}, "backgroundTertiary");
  const inputBgColor = useThemeColor({}, "backgroundSecondary");
  const inputBorderColor = useThemeColor({}, "borderColor");

  return (
    <React.Fragment>
      <View style={styles.packAmountContainer}>
        <Text style={[styles.packAmountLabel, { color }]}>Общее количество</Text>
        <Pressable
          style={[styles.packAmountPressable, { backgroundColor: bGColorTertiary }]}
          onPress={() => bottomSheetRef.current?.open()}
        >
          <Text style={[styles.packAmountText, { color }]}>
            {amountInPack ? amountInPack : "Задать"}
          </Text>
        </Pressable>
      </View>
      <CustomPicker
        label="Напомнить за срок (дни)"
        items={REMINDER_DAYS}
        selectedValue={localValue.refillDaysReminder}
        onValueSelected={handleRefillDaysSet}
        isSelectionVisible={isRefillDaysPickerVisible} // IOS ONLY
        triggerSelection={triggerRefillDaysPicker} // IOS ONLY
      />

      {/* TOTAL AMOUNT IN PACK */}
      <BottomSheetWrapper ref={bottomSheetRef} title="Количество в упаковке" snapPointPercent="40%">
        <View style={styles.bottomSheetContainer}>
          <Text style={[styles.bottomSheetlabel, { color }]}>Общее количество дозы.</Text>
          <View style={styles.bottomSheetInnerWrapper}>
            <BottomSheetTextInput
              style={[
                styles.bottomSheetInput,
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
              value={localValue.amountInPack}
              onChangeText={handleOnTextChange}
            />
            <Text style={[styles.bottomSheetText, { color }]}>
              Введите общую сумму в «{measurement}»
            </Text>
          </View>

          <CustomButton
            label="Задать"
            style={{ marginTop: "auto" }}
            onPress={handleSetAmountInPack}
          />
        </View>
      </BottomSheetWrapper>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  packAmountContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 16,
    paddingRight: 16,
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

  bottomSheetContainer: {
    height: 230,
    gap: 16,
  },
  bottomSheetInnerWrapper: {
    gap: 12,
  },
  bottomSheetlabel: {
    fontFamily: "Roboto_600SemiBold",
    fontSize: 18,
    lineHeight: 24,
  },
  bottomSheetText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 15,
    lineHeight: 19,
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
