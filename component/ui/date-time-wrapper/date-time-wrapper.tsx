import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { RefObject, useImperativeHandle, useRef, useState } from "react";
import { View } from "react-native";
import BottomSheetWrapper, { BottomSheetWrapperRef } from "../bottom-sheet-wrapper";
import CustomButton from "../custom-button/custom-button";

export interface DateTimeWrapperRef {
  showDateTime: () => void;
  closeDateTime: () => void;
}

export type DateTimeWrapperProps = {
  ref: RefObject<DateTimeWrapperRef | null>;
  mode: "date" | "time";
  bottomSheetTitle?: string;
  disabledDate?: boolean;

  // @platform IOS ONLY
  showUpdateButton?: boolean;
  onUpdateButtonPress?: () => void;
  // The event is only used with Android.
  onDateTimeSelected: (dateTime: Date, event?: DateTimePickerEvent["type"]) => void;
};

export default function DateTimeWrapper({
  ref,
  mode,
  bottomSheetTitle,
  onDateTimeSelected,
  showUpdateButton,
  onUpdateButtonPress,
  disabledDate = true,
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
  };

  return (
    <BottomSheetWrapper
      ref={bottomSheetWrapperRef}
      title={bottomSheetTitle || ""}
      snapPointPercent={showUpdateButton ? "50%" : "45%"}
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
          minimumDate={disabledDate && mode === "date" ? new Date(now) : undefined}
        />
        {showUpdateButton && <CustomButton label="Применить" onPress={onUpdateButtonPress} />}
      </View>
    </BottomSheetWrapper>
  );
}
