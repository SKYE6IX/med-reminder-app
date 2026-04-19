// import BottomSheetWrapper from "./bottom-sheet-wrapper";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { RefObject, useImperativeHandle, useState } from "react";
import { View } from "react-native";

export interface DateTimeWrapperRef {
  showDateTime: () => void;
  hideDateTime: () => void;
}

type DateTimeWrapperProps = {
  ref: RefObject<DateTimeWrapperRef | null>;
  mode: "date" | "time";
};

export default function DateTimePickerWrapper({
  ref,
  mode,
}: DateTimeWrapperProps) {
  const now = Date.now();

  const [date, setDate] = useState(new Date(now));

  const showMode = (currentMode: DateTimeWrapperProps["mode"]) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange(event, date) {},
      mode: currentMode,
      design: "material",
    });
  };

  useImperativeHandle(ref, () => ({
    showDateTime() {
      showMode(mode);
    },
    hideDateTime() {},
  }));

  return <View style={{ display: "none" }} />;
}
