import DateTimePicker from "@react-native-community/datetimepicker";
import { RefObject, useImperativeHandle, useRef, useState } from "react";
import { View } from "react-native";
import BottomSheetWrapper, {
  BottomSheetWrapperRef,
} from "./bottom-sheet-wrapper";

export interface DateTimeWrapperRef {
  showDateTime: () => void;
  hideDateTime: () => void;
}

type DateTimeWrappeProps = {
  ref: RefObject<DateTimeWrapperRef | null>;
  mode: "date" | "time";
  bottomSheetTitle: string;
};

export default function DateTimeWrapper({
  ref,
  mode,
  bottomSheetTitle,
}: DateTimeWrappeProps) {
  const now = Date.now();
  const bottomSheetWrapperRef = useRef<BottomSheetWrapperRef>(null);

  const [date, setDate] = useState(new Date(now));

  useImperativeHandle(ref, () => ({
    showDateTime() {
      bottomSheetWrapperRef.current?.open();
    },
    hideDateTime() {
      bottomSheetWrapperRef.current?.close();
    },
  }));

  return (
    <BottomSheetWrapper
      ref={bottomSheetWrapperRef}
      title={bottomSheetTitle}
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
          testID="dateTimePicker"
          value={date}
          mode={mode}
          onChange={() => {}}
          display={mode === "date" ? "inline" : "spinner"}
        />
      </View>
    </BottomSheetWrapper>
  );
}
