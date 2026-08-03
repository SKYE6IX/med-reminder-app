import { useThemeColor } from "@/hooks/use-theme-color";
import { RefObject, useCallback, useImperativeHandle, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

const PADDING_SPACE = 8;
const TAB_COUNT = 3;

type TabsProps = {
  tabs: { label: string; value: string }[];
  onTabChange: (tab: string) => void;
  ref?: RefObject<{ toNewTab: (tab: string, idx: number) => void } | null>;
};

export default function Tabs({ tabs, onTabChange, ref }: TabsProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);

  const offset = useSharedValue<number>(0);
  const TAB_WIDTH = (containerWidth - PADDING_SPACE * 2) / TAB_COUNT;

  const activeLabel = tabs.find((_, i) => i === tabIndex)?.label;

  const handlePress = useCallback(
    (tab: string, index: number) => {
      const newOffset = TAB_WIDTH * index;
      offset.set(() => withTiming(newOffset));
      setTabIndex(index);
      onTabChange(tab);
    },
    [TAB_WIDTH, offset, onTabChange],
  );

  useImperativeHandle(ref, () => {
    return {
      toNewTab(tab: string, idx: number) {
        handlePress(tab, idx);
      },
    };
  }, [handlePress]);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  // Themes
  const color = useThemeColor({}, "textPrimary");
  const tintColor = useThemeColor({}, "tint");
  const bgSecondary = useThemeColor({}, "backgroundSecondary");

  return (
    <View
      style={[styles.tabs, { backgroundColor: bgSecondary }]}
      onLayout={(event) => {
        setContainerWidth(event.nativeEvent.layout.width);
      }}
    >
      {tabs.map((tab, i) => (
        <Pressable
          key={tab.value}
          style={[styles.tab, { width: TAB_WIDTH }]}
          onPress={() => handlePress(tab.value, i)}
        >
          <Text style={[styles.tabLabel, { color }]}>{tab.label}</Text>
        </Pressable>
      ))}

      <Animated.View
        style={[
          styles.tabIndicator,
          animatedStyles,
          { backgroundColor: tintColor, width: TAB_WIDTH },
        ]}
      >
        <Text style={[styles.tabLabel, { color: "#F7F7F7" }]}>{activeLabel}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row",
    borderRadius: 16,
    padding: PADDING_SPACE,
    position: "relative",
  },

  tab: {
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
    height: 40,
    top: 8,
    left: 8,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
