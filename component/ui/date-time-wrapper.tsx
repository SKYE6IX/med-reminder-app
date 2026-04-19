import DateTimePicker from "@react-native-community/datetimepicker";
import { RefObject, useImperativeHandle, useRef, useState } from "react";
import { View } from "react-native";
import BottomSheetWrapper, {
  BottomSheetWrapperRef,
} from "./bottom-sheet-wrapper";
export interface DateTimeWrapperRef {
  showDateTime: () => void;
}

type DateTimeWrapperProps = {
  ref: RefObject<DateTimeWrapperRef | null>;
  mode: "date" | "time";
  bottomSheetTitle?: string;
};

export default function DateTimeWrapper({
  ref,
  mode,
  bottomSheetTitle,
}: DateTimeWrapperProps) {
  const now = Date.now();
  const bottomSheetWrapperRef = useRef<BottomSheetWrapperRef>(null);
  const [date, setDate] = useState(new Date(now));

  useImperativeHandle(ref, () => ({
    showDateTime() {
      bottomSheetWrapperRef.current?.open();
    },
  }));

  return (
    <BottomSheetWrapper
      ref={bottomSheetWrapperRef}
      title={bottomSheetTitle || ""}
      snapPointPercent="50%"
    >
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <DateTimePicker
          value={date}
          mode={mode}
          onChange={(event, date) => {}}
          display={mode === "date" ? "inline" : "spinner"}
        />
      </View>
    </BottomSheetWrapper>
  );
}
