import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { RefObject, useImperativeHandle, useState } from "react";
import { View } from "react-native";

export interface DateTimeWrapperRef {
  showDateTime: () => void;
}

type DateTimeWrapperProps = {
  ref: RefObject<DateTimeWrapperRef | null>;
  mode: "date" | "time";
  disabledDate?: boolean;
  onDateTimeChange: (dateTime: Date) => void;
};

const getNow = () => Date.now();

export default function DateTimeWrapper({
  ref,
  mode,
  onDateTimeChange: onDateTimeSelected,
  disabledDate,
}: DateTimeWrapperProps) {
  const [date, setDate] = useState(new Date(getNow()));

  const handleSetDateTime = (date: Date) => {
    if (date) {
      setDate(date);
      onDateTimeSelected(date);
    }
  };

  const showMode = (currentMode: DateTimeWrapperProps["mode"]) => {
    DateTimePickerAndroid.open({
      value: date,
      onValueChange(event, date) {
        handleSetDateTime(date);
      },
      mode: currentMode,
      is24Hour: true,
      minimumDate: disabledDate && mode === "date" ? new Date(getNow()) : undefined,
    });
  };

  useImperativeHandle(ref, () => ({
    showDateTime() {
      showMode(mode);
    },
  }));

  return <View style={{ display: "none" }} />;
}
