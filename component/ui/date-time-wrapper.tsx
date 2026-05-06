import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { RefObject, useImperativeHandle, useRef, useState } from "react";
import { View } from "react-native";
import BottomSheetWrapper, { BottomSheetWrapperRef } from "./bottom-sheet-wrapper";
import CustomButton from "./custom-button/custom-button";

export interface DateTimeWrapperRef {
  showDateTime: () => void;
  closeDateTime: () => void;
}

export type DateTimeWrapperProps = {
  ref: RefObject<DateTimeWrapperRef | null>;
  mode: "date" | "time";
  bottomSheetTitle?: string;

  // @platform IOS ONLY
  showButton?: boolean;
  onButtonPress?: () => void;
  // The event is only used with Android.
  onDateTimeSelected: (dateTime: Date, event?: DateTimePickerEvent["type"]) => void;
};

export default function DateTimeWrapper({
  ref,
  mode,
  bottomSheetTitle,
  onDateTimeSelected,
  showButton,
  onButtonPress,
}: DateTimeWrapperProps) {
  const now = Date.now();
  const bottomSheetWrapperRef = useRef<BottomSheetWrapperRef>(null);
  const [date, setDate] = useState(new Date(now));

  useImperativeHandle(ref, () => ({
    showDateTime() {
      bottomSheetWrapperRef.current?.open();
    },
    closeDateTime() {
      bottomSheetWrapperRef.current?.close();
    },
  }));

  const handleSetDateTime = (date?: Date) => {
    if (date) {
      setDate(date);
      onDateTimeSelected(date);
    }
    if (mode === "date") {
      bottomSheetWrapperRef.current?.close();
    }
  };

  return (
    <BottomSheetWrapper
      ref={bottomSheetWrapperRef}
      title={bottomSheetTitle || ""}
      snapPointPercent={showButton ? "50%" : "45%"}
    >
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
        }}
      >
        <DateTimePicker
          value={date}
          mode={mode}
          onChange={(event, date) => handleSetDateTime(date)}
          display={mode === "date" ? "inline" : "spinner"}
          locale="ru-RU"
          minimumDate={mode === "date" ? new Date(now) : undefined}
        />
        {showButton && <CustomButton label="Применить" onPress={onButtonPress} />}
      </View>
    </BottomSheetWrapper>
  );
}
