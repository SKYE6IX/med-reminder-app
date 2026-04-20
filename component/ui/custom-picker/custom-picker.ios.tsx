import { useThemeColor } from "@/hooks/use-theme-color";
import { PickerIOS } from "@react-native-picker/picker";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";

type CustomPickerProps = {
  items: { label: string; value: string }[];
  label: string;
  svgIcon?: React.ReactNode;
  isSelectionVisible?: boolean; // IOS ONLY
  triggerSelection?: () => void; // IOS ONLY
  onValueSelected: (selectedValue: string) => void;
};

export default function CustomPicker({
  items,
  label,
  svgIcon,
  onValueSelected,
  isSelectionVisible,
  triggerSelection,
}: CustomPickerProps) {
  const hasPopulated = useRef(false);
  const value = items[0].value;

  const [selectedValue, setSelectedValue] = useState<string>("");

  // Themes color
  const textColor = useThemeColor({}, "textPrimary");
  const borderColor = useThemeColor({}, "borderColor");
  const bGColorTertiary = useThemeColor({}, "backgroundTertiary");
  const bGColorSecondary = useThemeColor({}, "backgroundSecondary");
  const tintColor = useThemeColor({}, "tint");

  const height = useSharedValue(60);

  const populateSelectedvalue = useCallback(() => {
    if (!hasPopulated.current) {
      hasPopulated.current = true;
      setSelectedValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (isSelectionVisible) {
      populateSelectedvalue();
    }
    height.value = isSelectionVisible ? withSpring(280) : withSpring(60);
  }, [height, isSelectionVisible, populateSelectedvalue]);

  const getSelectedValueLabel = (value: string) => {
    return items.find((item) => item.value === value)?.label;
  };

  const handleValueChange = (value: string) => {
    setSelectedValue(value);
    onValueSelected(value);
  };

  return (
    <Animated.View
      style={[
        styles.customPickerWrapper,
        { backgroundColor: bGColorSecondary, height, overflow: "hidden" },
      ]}
    >
      <View style={styles.customPickerHeader}>
        {svgIcon}
        <Text style={[styles.customPickerLabel, { color: textColor }]}>
          {label}
        </Text>
        <Pressable
          style={[
            styles.customPickerPressable,
            { backgroundColor: bGColorTertiary },
          ]}
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

      <Animated.View style={{ opacity: isSelectionVisible ? undefined : 0 }}>
        <PickerIOS
          testID="picker"
          selectedValue={selectedValue}
          onValueChange={(itemValue) => handleValueChange(itemValue.toString())}
          style={{
            borderTopWidth: 1,
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
            <PickerIOS.Item
              key={item.value}
              label={item.label}
              value={item.value}
            />
          ))}
        </PickerIOS>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  customPickerWrapper: {
    borderRadius: 12,
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
