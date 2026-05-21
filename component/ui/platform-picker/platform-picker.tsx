import { useThemeColor } from "@/hooks/use-theme-color";
import { Picker } from "@react-native-picker/picker";
import { RefObject } from "react";
import { StyleProp, TextStyle } from "react-native";

export type PlatformPickerProps = {
  pickerRef: RefObject<Picker<string> | null> | null;
  selectedValue: string;
  items: { label: string; value: string }[];
  styles?: StyleProp<TextStyle>;
  handleOnValueChange: (value: string) => void;
  setIsSelectionVisible?: (value: boolean) => void;
};

export default function PlatformPicker({
  pickerRef,
  selectedValue,
  items,
  styles,
  handleOnValueChange,
  setIsSelectionVisible,
}: PlatformPickerProps) {
  const textColor = useThemeColor({}, "textPrimary");
  return (
    <Picker
      testID="picker"
      ref={pickerRef}
      selectedValue={selectedValue}
      onValueChange={handleOnValueChange}
      mode="dropdown"
      style={styles}
      itemStyle={{
        fontFamily: "Roboto_400Regular",
        fontSize: 16,
        lineHeight: 19.2,
        color: textColor,
      }}
      onFocus={() => {
        setIsSelectionVisible && setIsSelectionVisible(true);
      }}
      onBlur={() => {
        setIsSelectionVisible && setIsSelectionVisible(false);
      }}
    >
      {items.map((item) => (
        <Picker.Item key={item.value} label={item.label} value={item.value} />
      ))}
    </Picker>
  );
}
