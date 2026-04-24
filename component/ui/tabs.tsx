import { useThemeColor } from "@/hooks/use-theme-color";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const TAB_WIDTH = 110;
const TAB_SPACE = 8;

type TabsProps = {
  tabs: { label: string; value: string }[];
  onTabChange: (tab: string) => void;
};

export default function Tabs({ tabs, onTabChange }: TabsProps) {
  const [tabIndex, setTabIndex] = useState(0);
  const offset = useSharedValue<number>(0);

  const color = useThemeColor({}, "textPrimary");
  const tintColor = useThemeColor({}, "tint");
  const bgSecondary = useThemeColor({}, "backgroundSecondary");

  const handlePress = (tab: string, index: number) => {
    const newOffset = (TAB_WIDTH + TAB_SPACE * 1) * index;
    offset.value = withTiming(newOffset);
    setTabIndex(index);
    onTabChange(tab);
  };

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));
  const activeLabel = tabs.find((_, i) => i === tabIndex)?.label;

  return (
    <View style={[styles.tabs, { backgroundColor: bgSecondary }]}>
      {tabs.map((tab, i) => (
        <Pressable
          key={tab.value}
          style={[styles.tab]}
          onPress={() => handlePress(tab.value, i)}
        >
          <Text style={[styles.tabLabel, { color }]}>{tab.label}</Text>
        </Pressable>
      ))}
      <Animated.View
        style={[
          styles.tabIndicator,
          animatedStyles,
          { backgroundColor: tintColor },
        ]}
      >
        <Text style={[styles.tabLabel, { color: "#F7F7F7" }]}>
          {activeLabel}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 16,
    padding: TAB_SPACE,
    position: "relative",
  },
  tab: {
    width: TAB_WIDTH,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    lineHeight: 16.2,
  },
  tabIndicator: {
    position: "absolute",
    width: TAB_WIDTH,
    height: 40,
    top: 8,
    left: 8,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
