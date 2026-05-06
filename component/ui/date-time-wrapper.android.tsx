import { DateTimePickerAndroid, DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useImperativeHandle, useState } from "react";
import { View } from "react-native";
import { DateTimeWrapperProps } from "./date-time-wrapper";

export interface DateTimeWrapperRef {
  showDateTime: () => void;
}

export default function DateTimePickerWrapper({
  ref,
  mode,
  onDateTimeSelected,
}: DateTimeWrapperProps) {
  const now = Date.now();
  const [date, setDate] = useState(new Date(now));

  const handleSetDateTime = (date?: Date, event?: DateTimePickerEvent["type"]) => {
    if (date) {
      setDate(date);
      onDateTimeSelected(date, event);
    }
  };

  const showMode = (currentMode: DateTimeWrapperProps["mode"]) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange(event, date) {
        handleSetDateTime(date, event.type);
      },
      mode: currentMode,
      is24Hour: true,
      minimumDate: mode === "date" ? new Date(now) : undefined,
    });
  };

  useImperativeHandle(ref, () => ({
    showDateTime() {
      showMode(mode);
    },
    closeDateTime() {},
  }));

  return <View style={{ display: "none" }} />;
}
