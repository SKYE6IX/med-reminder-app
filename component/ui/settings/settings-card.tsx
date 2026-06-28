import ArrowRight from "@/component/icons/arrow-right";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Image } from "expo-image";
import React, { useState } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

type SettingsCardProps = {
  title: string;
  description: string;
  interaction?: "none" | "press" | "toggle";
  avatarUrl?: string;
  disabled?: boolean;
  toggleValue?: boolean;
  svgIcon?: React.ReactNode;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
};

export default function SettingsCard({
  title,
  description,
  interaction,
  avatarUrl,
  svgIcon,
  disabled,
  toggleValue,
  onPress,
  onToggle,
}: SettingsCardProps) {
  const [toggleSwitch, setToggleSwitch] = useState(toggleValue);
  // Themes color
  const color = useThemeColor({}, "textPrimary");
  const tintColor = useThemeColor({}, "tint");
  const mutedColor = useThemeColor({}, "textMuted");
  const borderColor = useThemeColor({}, "borderColor");
  const bgSecondary = useThemeColor({}, "backgroundSecondary");
  const bgTertiary = useThemeColor({}, "backgroundTertiary");

  const handleToggleSwitch = () => {
    const isToggle = !toggleSwitch;
    setToggleSwitch(isToggle);
    onToggle && onToggle(isToggle);
  };

  // Pressable
  if (interaction === "press") {
    return (
      <Pressable
        style={[styles.container, { backgroundColor: bgSecondary, borderColor }]}
        disabled={disabled}
        onPress={onPress}
      >
        {avatarUrl ? (
          <View style={styles.avatarWrapper}>
            <Image
              source={avatarUrl}
              style={styles.avatar}
              contentFit="cover"
              contentPosition="top center"
            />
          </View>
        ) : (
          <View style={[styles.iconLeftWrapper, { backgroundColor: bgTertiary }]}>{svgIcon}</View>
        )}

        <View style={styles.textWrapper}>
          <Text style={[styles.title, { color }]}>{title}</Text>
          <Text style={[styles.description, { color: mutedColor }]}>{description}</Text>
        </View>

        <View style={styles.rightElement}>
          <ArrowRight size={30} color={color} />
        </View>
      </Pressable>
    );
  }

  // Toggle
  if (interaction === "toggle") {
    return (
      <View style={[styles.container, { backgroundColor: bgSecondary, borderColor }]}>
        <View style={[styles.iconLeftWrapper, { backgroundColor: bgTertiary }]}>{svgIcon}</View>
        <View style={styles.textWrapper}>
          <Text style={[styles.title, { color }]}>{title}</Text>
          <Text style={[styles.description, { color: mutedColor }]}>{description}</Text>
        </View>

        <View style={styles.rightElement}>
          <Switch
            onValueChange={handleToggleSwitch}
            value={toggleSwitch}
            trackColor={{ false: bgTertiary, true: tintColor }}
            thumbColor="#F7F7F7"
          />
        </View>
      </View>
    );
  }

  // None
  return (
    <View style={[styles.container, { backgroundColor: bgSecondary, borderColor }]}>
      <View style={[styles.iconLeftWrapper, { backgroundColor: bgTertiary }]}>{svgIcon}</View>
      <View style={styles.textWrapper}>
        <Text style={[styles.title, { color }]}>{title}</Text>
        <Text style={[styles.description, { color: mutedColor }]}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 56,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatarWrapper: {
    width: 45,
    height: 45,
    borderRadius: 9999,
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  iconLeftWrapper: {
    width: 32,
    height: 32,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  rightElement: {
    marginLeft: "auto",
  },
  textWrapper: {
    gap: 4,
    flex: 1,
  },

  title: {
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
    lineHeight: 16.2,
  },

  description: {
    fontFamily: "Roboto_400Regular",
    fontSize: 12,
    lineHeight: 14,
  },
});
