import { useTranslation } from "@/i18next/i18next";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { View } from "react-native";
import CustomButton from "../custom-button/custom-button";

type DateTimeWrapperProps = {
  mode: "date" | "time";
  disabledDate?: boolean;
  onDateTimeChange: (dateTime: Date) => void;
  showUpdateButton?: boolean;
  onUpdateButtonPress?: () => void;
};

const getNow = () => Date.now();

export default function DateTimeWrapper({
  mode,
  disabledDate = true,
  onDateTimeChange,
  showUpdateButton,
  onUpdateButtonPress,
}: DateTimeWrapperProps) {
  const { t, i18n } = useTranslation();
  const [date, setDate] = useState(new Date(getNow()));

  const handleSetDateTime = (date?: Date) => {
    if (date) {
      setDate(date);
      onDateTimeChange(date);
    }
  };

  return (
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
        locale={i18n.language}
        minimumDate={disabledDate && mode === "date" ? new Date(getNow()) : undefined}
      />
      {showUpdateButton && <CustomButton label={t("common.apply")} onPress={onUpdateButtonPress} />}
    </View>
  );
}
