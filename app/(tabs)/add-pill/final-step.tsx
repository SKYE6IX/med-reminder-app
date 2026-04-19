import BellIcon from "@/component/icons/bell-icon";
import { useAddPillScreenStyles } from "@/component/shared-styles/add-pill-screen-styles";
import CustomButton from "@/component/ui/custom-button/custom-button";
import CustomPicker from "@/component/ui/custom-picker";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useState } from "react";
import {
  Platform,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";

const TOTAL_DOSAGES = Array.from({ length: (100 - 1) / 0.5 + 1 }, (_, i) => {
  const value = 1 + i * 0.5;
  return {
    label: `${value}`,
    value: `${value}`,
  };
});
const REMINDER_DAYS = Array.from({ length: 7 }, (_, i) => ({
  label: `${1 + i}`,
  value: `${1 + i}`,
}));
const COLLAPSED = 75;
const HALF_EXPAND = 197;
const FULL_EXPAND = 417;

export default function FinalStepScreen() {
  const isIOS = Platform.OS === "ios";
  const sharedStyles = useAddPillScreenStyles();

  const [showRefillBox, setShowRefillBox] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState("");

  // @platform IOS ONLY
  const [isDosageAmountPickerVisible, setIsDosageAmountPickerVisible] =
    useState(false);
  // @platform IOS ONLY
  const [isRefillDaysPickerVisible, setIsRefillDaysPickerVisible] =
    useState(false);

  // Themes color
  const color = useThemeColor({}, "textPrimary");
  const colorMuted = useThemeColor({}, "textMuted");
  const bGColor = useThemeColor({}, "backgroundSecondary");
  const bGTertiary = useThemeColor({}, "backgroundTertiary");
  const borderColor = useThemeColor({}, "borderColor");
  const tintColor = useThemeColor({}, "tint");

  const refillSettingHeight = useSharedValue(COLLAPSED);

  // @platform ANDROID ONLY
  const pickersWrapperOpacity = useSharedValue(0);

  const toggleSwitch = () => {
    const isToggle = !showRefillBox;
    refillSettingHeight.value = withSpring(isToggle ? HALF_EXPAND : COLLAPSED);

    pickersWrapperOpacity.value = withDelay(
      isToggle ? 200 : 0,
      withSpring(isToggle ? 1 : 0, {
        duration: isToggle ? 400 : 100,
      }),
    );

    if (isToggle) {
      // Reset the picker state incase user switch the toggle while the state is still active
      setIsDosageAmountPickerVisible(false);
      setIsRefillDaysPickerVisible(false);
    }
    setShowRefillBox(isToggle);
  };

  // @platform IOS ONLY
  // It control the height for the container when the pickers are triger.
  // it goes from HALF_EXPAND to FULL_EXPAND.
  const controlFullExpand = (isPicker: boolean) => {
    const isActive = !isPicker;
    if (isActive && refillSettingHeight.value === FULL_EXPAND) return;
    refillSettingHeight.value = withSpring(
      isActive ? FULL_EXPAND : HALF_EXPAND,
    );
  };

  // @platform IOS ONLY
  const triggerDosageAmountPicker = () => {
    if (!isIOS) return;
    // Flip refill day picker to false only of it's true.
    if (isRefillDaysPickerVisible) {
      setIsRefillDaysPickerVisible(false);
    }
    controlFullExpand(isDosageAmountPickerVisible);
    setIsDosageAmountPickerVisible(!isDosageAmountPickerVisible);
  };

  // @platform IOS ONLY
  const triggerRefillDaysPicker = () => {
    if (!isIOS) return;
    // Flip dosage amount picker to false only of it's true.
    if (isDosageAmountPickerVisible) {
      setIsDosageAmountPickerVisible(false);
    }
    controlFullExpand(isRefillDaysPickerVisible);
    setIsRefillDaysPickerVisible(!isRefillDaysPickerVisible);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    height: refillSettingHeight.value,
  }));

  return (
    <View style={[styles.container, sharedStyles.container]}>
      {/* Refill setting container */}
      <View style={sharedStyles.sectionContainer}>
        <Text style={sharedStyles.title}>Напоминание о пополнении</Text>
        <Animated.View
          style={[
            styles.refillSettingWrapper,
            {
              borderColor,
              backgroundColor: bGColor,
              overflow: isIOS ? "hidden" : undefined,
            },
            animatedStyle,
          ]}
        >
          <View style={styles.refillSettingTop}>
            <View
              style={[
                styles.refillSettingIcon,
                { backgroundColor: bGTertiary },
              ]}
            >
              <BellIcon />
            </View>
            <View style={styles.refillSettingTextWrapper}>
              <Text style={[styles.refillSettingTextLabel, { color }]}>
                Напоминание
              </Text>
              <Text
                style={[styles.refillSettingTextInfo, { color: colorMuted }]}
              >
                Уведомить до окончания запаса
              </Text>
            </View>
            <View>
              <Switch
                onValueChange={toggleSwitch}
                value={showRefillBox}
                trackColor={{ false: bGTertiary, true: tintColor }}
                thumbColor="#F7F7F7"
              />
            </View>
          </View>

          <Animated.View
            style={{
              opacity: !isIOS ? pickersWrapperOpacity : undefined,
              pointerEvents: showRefillBox ? "auto" : "none",
            }}
          >
            <CustomPicker
              label="Всего в упаковке"
              items={TOTAL_DOSAGES}
              onValueSelected={() => {}}
              isSelectionVisible={isDosageAmountPickerVisible}
              triggerSelection={triggerDosageAmountPicker}
            />

            <CustomPicker
              label="Напомнить за срок"
              items={REMINDER_DAYS}
              onValueSelected={() => {}}
              isSelectionVisible={isRefillDaysPickerVisible}
              triggerSelection={triggerRefillDaysPicker}
            />
          </Animated.View>
        </Animated.View>
      </View>

      {/* Note settings */}
      <View style={sharedStyles.sectionContainer}>
        <Text style={sharedStyles.title}>Заметки</Text>
        <TextInput
          value={textAreaValue}
          onChangeText={(value) => setTextAreaValue(value)}
          autoCorrect={true}
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top"
          scrollEnabled={true}
          returnKeyType="default"
          keyboardType="default"
          placeholder="Заметка о лекарстве"
          placeholderTextColor="#9E9E9E"
          maxLength={500}
          style={[
            styles.textAreaInput,
            { borderColor, backgroundColor: bGColor, color },
          ]}
        />
      </View>

      <CustomButton label="Далее" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 32,
  },
  refillSettingWrapper: {
    borderWidth: 1,
    borderRadius: 16,
    paddingLeft: 16,
    paddingRight: 16,
  },
  refillSettingTop: {
    height: 75,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  refillSettingIcon: {
    width: 38,
    height: 38,
    borderRadius: 38,
    justifyContent: "center",
    alignItems: "center",
  },
  refillSettingTextWrapper: {
    width: 200,
    gap: 3,
  },
  refillSettingTextLabel: {
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
    lineHeight: 19.2,
  },
  refillSettingTextInfo: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    lineHeight: 16.2,
  },
  textAreaInput: {
    borderWidth: 1,
    borderRadius: 16,
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    padding: 16,
    lineHeight: 16.8,
    minHeight: 100,
    maxHeight: 200,
  },
});
