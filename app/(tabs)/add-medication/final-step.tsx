import BellIcon from "@/component/icons/bell-icon";
import { useAddPillScreenStyles } from "@/component/shared-styles/add-pill-screen-styles";
import CustomButton from "@/component/ui/custom-button/custom-button";
import CustomPicker from "@/component/ui/custom-picker/custom-picker";
import Loader from "@/component/ui/loader";
import { useMutation } from "@/hooks/use-mutation";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAddPillStore } from "@/stores/add-pill-store";
import { CreateMedication, MedicationProfileResponse } from "@/types/medication";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Platform, StyleSheet, Switch, Text, TextInput, View } from "react-native";
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
  const router = useRouter();
  const isIOS = Platform.OS === "ios";

  const { formState, setMedicationDetails, setMedicationpack, clearFormState } = useAddPillStore();

  const sharedStyles = useAddPillScreenStyles();

  const [showRefillBox, setShowRefillBox] = useState(false);
  const refillSettingHeight = useSharedValue(COLLAPSED);

  // @platform ANDROID ONLY
  const pickersWrapperOpacity = useSharedValue(0);

  // @platform IOS ONLY
  const [isDosageAmountPickerVisible, setIsDosageAmountPickerVisible] = useState(false);
  // @platform IOS ONLY
  const [isRefillDaysPickerVisible, setIsRefillDaysPickerVisible] = useState(false);

  const totalDosageAmount = formState.medicationPack
    ? `${formState.medicationPack.totalQuantity}`
    : "";
  const refillDaysReminder = formState.medicationPack ? formState.medicationPack.notifyRule : "";
  const medicationNote = formState.medicationNote ? formState.medicationNote : "";

  // Themes color
  const color = useThemeColor({}, "textPrimary");
  const colorMuted = useThemeColor({}, "textMuted");
  const bGColor = useThemeColor({}, "backgroundSecondary");
  const bGTertiary = useThemeColor({}, "backgroundTertiary");
  const borderColor = useThemeColor({}, "borderColor");
  const tintColor = useThemeColor({}, "tint");

  const toggleSwitch = () => {
    const isToggle = !showRefillBox;

    refillSettingHeight.value = withSpring(isToggle ? HALF_EXPAND : COLLAPSED);

    // @platform ANDROID ONLY
    pickersWrapperOpacity.value = withDelay(
      isToggle ? 200 : 0,
      withSpring(isToggle ? 1 : 0, {
        duration: isToggle ? 400 : 100,
      }),
    );

    // @platform IOS ONLY
    if (isToggle) {
      // Reset the picker state incase user switch the toggle while the state is still active
      setIsDosageAmountPickerVisible(false);
      setIsRefillDaysPickerVisible(false);
    }
    // We reset the pack state back null, if switch state is false.
    if (!isToggle) {
      setMedicationpack(null);
    }
    setShowRefillBox(isToggle);
  };

  const handleTotalDosageAmtSet = (selectedValue: string) => {
    setMedicationpack({
      totalQuantity: Number(selectedValue),
      notifyRule: refillDaysReminder,
    });
  };

  const handleRefillDaysSet = (selectedValue: string) => {
    setMedicationpack({
      totalQuantity: Number(totalDosageAmount),
      notifyRule: selectedValue,
    });
  };

  const handleOnTextChange = (text: string) => {
    if (text.length < 1) {
      setMedicationDetails({ medicationNote: null });
    } else {
      setMedicationDetails({ medicationNote: text });
    }
  };

  // @platform IOS ONLY
  // It control the height for the container when the pickers are trriger.
  // it goes from HALF_EXPAND to FULL_EXPAND.
  const controlFullExpand = (isPicker: boolean) => {
    const isActive = !isPicker;
    if (isActive && refillSettingHeight.value === FULL_EXPAND) return;
    refillSettingHeight.value = withSpring(isActive ? FULL_EXPAND : HALF_EXPAND);
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
    if (!totalDosageAmount) {
      setMedicationpack({
        totalQuantity: Number(TOTAL_DOSAGES[0].value),
        notifyRule: refillDaysReminder,
      });
    }
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
    if (!refillDaysReminder) {
      setMedicationpack({
        totalQuantity: Number(totalDosageAmount),
        notifyRule: REMINDER_DAYS[0].value,
      });
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    height: refillSettingHeight.value,
  }));

  // Create a new medication
  const [createMedication, { loading }] = useMutation<MedicationProfileResponse, CreateMedication>({
    url: "medications",
    method: "post",
    onSuccess(data, variables) {
      router.dismissAll();
      clearFormState();
      router.navigate("/(tabs)");
    },
  });

  const createMedicationSchedule = async () => {
    const data: CreateMedication = {
      ...formState,
      schedule: {
        dosage: formState.schedule.dosage,
        recurrenceRule: formState.schedule.rule.recurrenceRule,
        startDate: formState.schedule.startDate,
        timeZone: formState.schedule.timeZone,
      },
    };
    await createMedication(data);
  };

  return (
    <View style={[styles.container, sharedStyles.container]}>
      <Loader visible={loading} />

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
            <View style={[styles.refillSettingIcon, { backgroundColor: bGTertiary }]}>
              <BellIcon />
            </View>
            <View style={styles.refillSettingTextWrapper}>
              <Text style={[styles.refillSettingTextLabel, { color }]}>Напоминание</Text>
              <Text style={[styles.refillSettingTextInfo, { color: colorMuted }]}>
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
              label="Общее количество"
              items={TOTAL_DOSAGES}
              selectedValue={totalDosageAmount}
              onValueSelected={handleTotalDosageAmtSet}
              isSelectionVisible={isDosageAmountPickerVisible} // IOS ONLY
              triggerSelection={triggerDosageAmountPicker} // IOS ONLY
            />

            <CustomPicker
              label="Напомнить за срок (дни)"
              items={REMINDER_DAYS}
              selectedValue={refillDaysReminder}
              onValueSelected={handleRefillDaysSet}
              isSelectionVisible={isRefillDaysPickerVisible} // IOS ONLY
              triggerSelection={triggerRefillDaysPicker} // IOS ONLY
            />
          </Animated.View>
        </Animated.View>
      </View>

      {/* Note settings */}
      <View style={sharedStyles.sectionContainer}>
        <Text style={sharedStyles.title}>Заметки</Text>
        <TextInput
          value={medicationNote}
          onChangeText={(value) => handleOnTextChange(value)}
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
          style={[styles.textAreaInput, { borderColor, backgroundColor: bGColor, color }]}
        />
      </View>
      <CustomButton label="Создать" onPress={createMedicationSchedule} disabled={loading} />
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
