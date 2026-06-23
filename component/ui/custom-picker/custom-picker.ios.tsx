import { useThemeColor } from "@/hooks/use-theme-color";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import PlatformPicker from "../platform-picker/platform-picker.ios";
import { CustomPickerProps } from "./custom-picker";

export default function CustomPicker({
  items,
  label,
  svgIcon,
  onValueSelected,
  isSelectionVisible,
  triggerSelection,
  selectedValue,
}: CustomPickerProps) {
  // Themes color
  const textColor = useThemeColor({}, "textPrimary");
  const bGColorTertiary = useThemeColor({}, "backgroundTertiary");
  const bGColorSecondary = useThemeColor({}, "backgroundSecondary");
  const tintColor = useThemeColor({}, "tint");

  const height = useSharedValue(60);

  useEffect(() => {
    height.value = isSelectionVisible ? withSpring(280) : withSpring(60);
  }, [height, isSelectionVisible]);

  const getSelectedValueLabel = (value: string) => {
    return items.find((item) => item.value === value)?.label;
  };

  const handleValueChange = (value: string) => {
    onValueSelected(value);
  };

  return (
    <Animated.View
      style={[
        styles.customPickerWrapper,
        {
          backgroundColor: bGColorSecondary,
          height,
          overflow: "hidden",
        },
      ]}
    >
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

      <Animated.View style={{ opacity: isSelectionVisible ? undefined : 0 }}>
        <PlatformPicker
          selectedValue={selectedValue}
          handleOnValueChange={handleValueChange}
          items={items}
          iosBorder={true}
        />
      </Animated.View>
    </Animated.View>
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
    width: 80,
    marginLeft: "auto",
    padding: 7,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  customePickerPressableText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
    lineHeight: 16.2,
  },
});
