import DateTimePicker from "@react-native-community/datetimepicker";
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
  onDateTimeChange: (dateTime: Date) => void;
  // @platform IOS ONLY
  showUpdateButton?: boolean;
  onUpdateButtonPress?: () => void;
};

const getNow = () => Date.now();

export default function DateTimeWrapper({
  ref,
  mode,
  bottomSheetTitle,
  onDateTimeChange,
  showUpdateButton,
  onUpdateButtonPress,
  disabledDate = true,
}: DateTimeWrapperProps) {
  const bottomSheetWrapperRef = useRef<BottomSheetWrapperRef>(null);

  const [date, setDate] = useState(new Date(getNow()));

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
      onDateTimeChange(date);
    }
  };

  return (
    <BottomSheetWrapper
      ref={bottomSheetWrapperRef}
      title={bottomSheetTitle || ""}
      snapPointPercent={showUpdateButton ? "45%" : "40%"}
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
          onValueChange={(event, date) => handleSetDateTime(date)}
          display={mode === "date" ? "inline" : "spinner"}
          locale="ru-RU"
          minimumDate={disabledDate && mode === "date" ? new Date(getNow()) : undefined}
        />
        {showUpdateButton && <CustomButton label="Применить" onPress={onUpdateButtonPress} />}
      </View>
    </BottomSheetWrapper>
  );
}
