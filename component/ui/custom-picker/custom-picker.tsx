import { useThemeColor } from "@/hooks/use-theme-color";
import { Picker } from "@react-native-picker/picker";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export type CustomPickerProps = {
  label: string;
  items: { label: string; value: string }[];
  selectedValue: string;
  svgIcon?: React.ReactNode;
  isSelectionVisible?: boolean; // IOS ONLY
  triggerSelection?: () => void; // IOS ONLY
  onValueSelected: (selectedValue: string) => void;
};

export default function CustomPicker({
  items,
  svgIcon,
  label,
  onValueSelected,
  selectedValue,
}: CustomPickerProps) {
  const [localValue, setLocalValue] = useState(selectedValue);
  const [isSelectionVisible, setIsSelectionVisible] = useState(false);
  const pickerRef = useRef<Picker<string>>(null);

  //   Theme color
  const textColor = useThemeColor({}, "textPrimary");
  const bGColorTertiary = useThemeColor({}, "backgroundTertiary");
  const bGColorSecondary = useThemeColor({}, "backgroundSecondary");
  const tintColor = useThemeColor({}, "tint");

  const triggerSelection = () => {
    const isVisible = !isSelectionVisible;
    if (isVisible) {
      pickerRef.current?.focus();
      if (!selectedValue) {
        onValueSelected(items[0].value);
        setLocalValue(items[0].value);
      }
    } else {
      pickerRef.current?.blur();
    }
    setIsSelectionVisible(isVisible);
  };

  const getSelectedValueLabel = (value: string) => {
    return items.find((item) => item.value.toUpperCase() === value.toUpperCase())?.label;
  };

  const handleValueChange = (value: string) => {
    onValueSelected(value);
  };

  return (
    <View style={[styles.customPickerWrapper, { backgroundColor: bGColorSecondary }]}>
      <View style={styles.customPickerHeader}>
        {svgIcon}
        <Text style={[styles.customPickerLabel, { color: textColor }]}>{label}</Text>
        <Pressable
          style={[styles.customPickerPressable, { backgroundColor: bGColorTertiary }]}
          onPress={triggerSelection}
          role="button"
        >
          <Text
            style={[
              styles.customePickerPressableText,
              { color: isSelectionVisible ? tintColor : textColor },
            ]}
          >
            {selectedValue ? getSelectedValueLabel(selectedValue) : "Выбрать"}
          </Text>
        </Pressable>
      </View>
      <Picker
        testID="picker"
        ref={pickerRef}
        selectedValue={localValue}
        onValueChange={(itemValue) => handleValueChange(itemValue)}
        mode="dropdown"
        style={{
          opacity: 0,
          height: 0,
          pointerEvents: "none",
        }}
        onFocus={() => setIsSelectionVisible(true)}
        onBlur={() => setIsSelectionVisible(false)}
        itemStyle={{
          fontFamily: "Roboto_400Regular",
          fontSize: 16,
          lineHeight: 19.2,
          color: textColor,
        }}
      >
        {items.map((item) => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  customPickerWrapper: {
    borderRadius: 16,
    paddingLeft: 16,
    paddingRight: 16,
  },
  customPickerHeader: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  customPickerLabel: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    lineHeight: 19.2,
  },
  customPickerPressable: {
    minWidth: 70,
    marginLeft: "auto",
    padding: 8,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  customePickerPressableText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    lineHeight: 16.2,
  },
});
