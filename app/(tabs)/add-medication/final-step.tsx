import BellIcon from "@/component/icons/bell-icon";
import { useAddPillScreenStyles } from "@/component/shared-styles/add-pill-screen-styles";
import CustomButton from "@/component/ui/custom-button/custom-button";
import Loader from "@/component/ui/loader";
import MedicationPackPicker from "@/component/ui/medication-pack-picker";
import SubscriptionBanner, { SubscriptionBannerRef } from "@/component/ui/subscription-banner";
import { createScheduleEventNotification } from "@/helpers/create-schedule-event-notifications";
import { NotificationHelper } from "@/helpers/notification-helper";
import { useSubscriptionPlanQuery } from "@/hooks/use-subscription-plan-query";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAddPillStore } from "@/stores/add-pill-store";
import { useAppSettingsStore } from "@/stores/app-settings-store";
import { CreateMedication, MedicationProfile } from "@/types/medication";
import { api, axios } from "@/utils/axiosInstance";
import { queryClient } from "@/utils/query-client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Platform, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";

const COLLAPSED = 75;
const HALF_EXPAND = 197;
const FULL_EXPAND = 417;

const createMedicationMutation = async (body: CreateMedication) => {
  const response = await api.post<MedicationProfile>("medications", body);
  return response.data;
};

export default function FinalStepScreen() {
  const openBannerRef = useRef<SubscriptionBannerRef>(null);

  const router = useRouter();
  const isIOS = Platform.OS === "ios";

  const { notfication, reminderPreferences } = useAppSettingsStore();
  const { formState, setMedicationDetails, setMedicationpack, clearFormState } = useAddPillStore();
  const { isPremiumPlan } = useSubscriptionPlanQuery();

  const sharedStyles = useAddPillScreenStyles();

  const [showRefillBox, setShowRefillBox] = useState(false);
  const refillSettingHeight = useSharedValue(COLLAPSED);

  // @platform ANDROID ONLY
  const pickersWrapperOpacity = useSharedValue(0);

  const amountInPack = formState.medicationPack ? formState.medicationPack.totalQuantity : "";
  const refillDaysReminder = formState.medicationPack
    ? `${formState.medicationPack.reminderDays}`
    : "";
  const medicationNote = formState.medicationNote ? formState.medicationNote : "";

  // Themes color
  const color = useThemeColor({}, "textPrimary");
  const colorMuted = useThemeColor({}, "textMuted");
  const bGColor = useThemeColor({}, "backgroundSecondary");
  const bGTertiary = useThemeColor({}, "backgroundTertiary");
  const borderColor = useThemeColor({}, "borderColor");
  const tintColor = useThemeColor({}, "tint");

  const toggleSwitch = () => {
    if (!isPremiumPlan) {
      openBannerRef.current?.toggleBanner();
    } else {
      const isToggle = !showRefillBox;

      refillSettingHeight.value = withSpring(isToggle ? HALF_EXPAND : COLLAPSED);

      // @platform ANDROID ONLY
      pickersWrapperOpacity.value = withDelay(
        isToggle ? 200 : 0,
        withSpring(isToggle ? 1 : 0, {
          duration: isToggle ? 400 : 100,
        }),
      );

      // We reset the pack state back null, if switch state is false.
      if (!isToggle) {
        setMedicationpack(null);
      }

      setShowRefillBox(isToggle);
    }
  };

  const handleAmountInPackSet = (selectedValue: string) => {
    setMedicationpack({
      totalQuantity: selectedValue,
      reminderDays: Number(refillDaysReminder),
    });
  };

  const handleRefillDaysSet = (selectedValue: string) => {
    setMedicationpack({
      totalQuantity: amountInPack,
      reminderDays: Number(selectedValue),
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

  const animatedStyle = useAnimatedStyle(() => ({
    height: refillSettingHeight.value,
  }));

  const { mutate, isPending } = useMutation({
    mutationFn: createMedicationMutation,
    async onSuccess(incomingData, variable) {
      // Update the cache for medication profiles.
      queryClient.setQueryData(
        ["medication-profile", "list"],
        (existingData: MedicationProfile[]) =>
          existingData ? [...existingData, incomingData] : [incomingData],
      );

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["schedule-events"] }),
        createScheduleEventNotification({
          ...notfication,
          ...reminderPreferences,
        }),
      ]);

      clearFormState();
      router.dismissAll();
      router.navigate("/");
    },
    onError(error) {
      if (axios.isAxiosError(error)) {
        console.log("An axios error occur when create a medication -> ", error);
      } else {
        console.log("Unknow error occur when create a medication -> ", error);
      }
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

    const notifcationAllowed = await NotificationHelper.checkNotificationPermission();
    if (!notifcationAllowed) {
      const allowed = await NotificationHelper.allowsNotificationsAsync();
      if (!allowed) {
        alert("Allow to notification for us to create schedules");
        return;
      }
    }
    mutate(data);
  };

  return (
    <ScrollView>
      <View style={[styles.container, sharedStyles.container]}>
        <Loader visible={isPending} />

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
              <MedicationPackPicker
                amountInPack={amountInPack}
                refillDaysReminder={refillDaysReminder}
                onAmountInPackSet={handleAmountInPackSet}
                onRefillDaysReminderSet={handleRefillDaysSet}
                onPickerTrigger={controlFullExpand}
                isToggle={showRefillBox}
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
        <CustomButton label="Создать" onPress={createMedicationSchedule} disabled={isPending} />
      </View>

      {/* SUBSCRIPTION OFFER */}
      <SubscriptionBanner ref={openBannerRef} />
    </ScrollView>
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
