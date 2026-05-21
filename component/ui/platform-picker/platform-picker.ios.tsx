import { useThemeColor } from "@/hooks/use-theme-color";
import { PickerIOS } from "@react-native-picker/picker";
import { useState } from "react";

type PlatformPickerProps = {
  selectedValue: string;
  items: { label: string; value: string }[];
  handleOnValueChange: (value: string) => void;
  iosBorder: boolean;
};

export default function PlatformPicker({
  selectedValue,
  handleOnValueChange,
  items,
  iosBorder = false,
}: PlatformPickerProps) {
  const [localValue, setLocalValue] = useState(selectedValue);

  const textColor = useThemeColor({}, "textPrimary");
  const borderColor = useThemeColor({}, "borderColor");

  const handleSetLocalValue = (value: string) => {
    setLocalValue(value);
    handleOnValueChange(value);
  };

  return (
    <PickerIOS
      testID="picker"
      selectedValue={localValue}
      onValueChange={(itemValue) => handleSetLocalValue(itemValue.toString())}
      style={{
        borderTopWidth: iosBorder ? 1 : 0,
        borderColor,
        marginTop: -8,
      }}
      itemStyle={{
        fontFamily: "Roboto_400Regular",
        fontSize: 18,
        lineHeight: 21.2,
        color: textColor,
      }}
    >
      {items.map((item) => (
        <PickerIOS.Item key={item.value} label={item.label} value={item.value} />
      ))}
    </PickerIOS>
  );
}
