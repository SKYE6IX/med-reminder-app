import { useEffect, useState } from "react";
import { Platform } from "react-native";
import CustomPicker from "./custom-picker/custom-picker";

const AMOUNTS_IN_PACK = Array.from({ length: (100 - 1) / 0.5 + 1 }, (_, i) => {
  const value = 1 + i * 0.5;
  return {
    label: `${value}`,
    value: `${value}`,
  };
});

const REMINDER_DAYS = Array.from({ length: 7 }, (_, i) => ({
  label: `${1 + i}`,
  value: `${1 + i}`,
}));

type MedicationPackPickerProps = {
  amountInPack: string;
  refillDaysReminder: string;
  onAmountInPackSet: (value: string) => void;
  onRefillDaysReminderSet: (value: string) => void;

  // @platform IOS ONLY!!!
  // This callback funtion is used in "final step screen" on add-medication page.
  // Used to expand the height of the box where the picker is placed.
  onPickerTrigger?: (isPicker: boolean) => void;
  // A custom tracker for "final step screen" on add-medication page.
  // We track when the switch is toggle so we can reset the "isAmounInPackPickerVisible" and
  // "isRefillDaysPickerVisible" state back to default;
  isToggle?: boolean;
};

export default function MedicationPackPicker({
  amountInPack,
  refillDaysReminder,
  onAmountInPackSet,
  onRefillDaysReminderSet,
  onPickerTrigger,
  isToggle,
}: MedicationPackPickerProps) {
  const isIOS = Platform.OS === "ios";

  const [localValue, setLocalValue] = useState({
    amountInPack,
    refillDaysReminder,
  });

  // @platform IOS ONLY
  const [isAmounInPackPickerVisible, setIsAmountInPackPickerVisible] = useState(false);
  const [isRefillDaysPickerVisible, setIsRefillDaysPickerVisible] = useState(false);
  // ** END **

  useEffect(() => {
    if (!isToggle) {
      setIsAmountInPackPickerVisible(false);
      setIsRefillDaysPickerVisible(false);
      setLocalValue({ amountInPack: "", refillDaysReminder: "" });
    }
  }, [isToggle]);

  // @platform IOS ONLY
  const triggerAmountInPackPicker = () => {
    if (!isIOS) return;

    // Flip refill day picker to false only of it's true.
    if (isRefillDaysPickerVisible) {
      setIsRefillDaysPickerVisible(false);
    }

    onPickerTrigger && onPickerTrigger(isAmounInPackPickerVisible);

    setIsAmountInPackPickerVisible(!isAmounInPackPickerVisible);

    if (!localValue.amountInPack) {
      setLocalValue((prv) => ({ ...prv, amountInPack: AMOUNTS_IN_PACK[0].value }));
    }
  };

  // @platform IOS ONLY
  const triggerRefillDaysPicker = () => {
    if (!isIOS) return;
    // Flip dosage amount picker to false only of it's true.
    if (isAmounInPackPickerVisible) {
      setIsAmountInPackPickerVisible(false);
    }

    onPickerTrigger && onPickerTrigger(isRefillDaysPickerVisible);

    setIsRefillDaysPickerVisible(!isRefillDaysPickerVisible);
    if (!localValue.refillDaysReminder) {
      setLocalValue((prv) => ({ ...prv, refillDaysReminder: REMINDER_DAYS[0].value }));
    }
  };

  const handleAmountInPackSet = (selectedValue: string) => {
    onAmountInPackSet(selectedValue);
    setLocalValue((prv) => ({ ...prv, amountInPack: selectedValue }));
  };

  const handleRefillDaysSet = (selectedValue: string) => {
    onRefillDaysReminderSet(selectedValue);
    setLocalValue((prv) => ({ ...prv, refillDaysReminder: selectedValue }));
  };

  return (
    <>
      <CustomPicker
        label="Общее количество"
        items={AMOUNTS_IN_PACK}
        selectedValue={localValue.amountInPack}
        onValueSelected={handleAmountInPackSet}
        isSelectionVisible={isAmounInPackPickerVisible} // IOS ONLY
        triggerSelection={triggerAmountInPackPicker} // IOS ONLY
      />

      <CustomPicker
        label="Напомнить за срок (дни)"
        items={REMINDER_DAYS}
        selectedValue={localValue.refillDaysReminder}
        onValueSelected={handleRefillDaysSet}
        isSelectionVisible={isRefillDaysPickerVisible} // IOS ONLY
        triggerSelection={triggerRefillDaysPicker} // IOS ONLY
      />
    </>
  );
}
