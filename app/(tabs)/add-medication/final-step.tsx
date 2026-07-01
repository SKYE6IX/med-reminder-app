import BellIcon from "@/component/icons/bell-icon";
import { useAddPillScreenStyles } from "@/component/shared-styles/add-pill-screen-styles";
import CustomButton from "@/component/ui/custom-button/custom-button";
import Loader from "@/component/ui/loader";
import MedicationPackPicker from "@/component/ui/medication-pack-picker";
import SubscriptionBanner, { SubscriptionBannerRef } from "@/component/ui/subscription-banner";
import { NotificationHelper } from "@/helpers/notification-helper";
import { createScheduleEventNotification } from "@/helpers/schedule-new-event-notifications";
import { useSubscriptionPlanQuery } from "@/hooks/use-subscription-plan-query";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAddPillStore } from "@/stores/add-pill-store";
import { useAppSettingsStore } from "@/stores/app-settings-store";
import { useFeedBackStore } from "@/stores/feedback-store";
import { CreateMedicationProfile, MedicationProfileReponse } from "@/types/medication";
import { api } from "@/utils/axiosInstance";
import { queryClient } from "@/utils/query-client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
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
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const COLLAPSED = 75;
const HALF_EXPAND = 260;
const FULL_EXPAND = 460;

const createMedicationMutation = async (body: CreateMedicationProfile) => {
  const response = await api.post<MedicationProfileReponse>("medications", body);
  return response.data;
};

export default function FinalStepScreen() {
  const sharedStyles = useAddPillScreenStyles();

  const insets = useSafeAreaInsets();
  const isIOS = Platform.OS === "ios";

  const router = useRouter();
  const openBannerRef = useRef<SubscriptionBannerRef>(null);
  const { showFeedBack } = useFeedBackStore();

  const { notfication, reminderPreferences } = useAppSettingsStore();
  const { formState, setMedicationDetails, setMedicationpack, clearFormState } = useAddPillStore();
  const { isPremiumPlan } = useSubscriptionPlanQuery();

  const [showRefillBox, setShowRefillBox] = useState(false);
  const [version, setVersion] = useState(0);
  const refillSettingHeight = useSharedValue(COLLAPSED);

  const amountInPack = formState.medicationPack ? formState.medicationPack.totalQuantity : "";
  const refillDaysReminder = formState.medicationPack
    ? String(formState.medicationPack.reminderDays)
    : "";
  const medicationNote = formState.medicationNote ? formState.medicationNote : "";

  // @platform ANDROID ONLY
  const pickersWrapperOpacity = useSharedValue(0);

  // Add medication pack toggle switch
  const toggleSwitch = () => {
    if (!isPremiumPlan) {
      openBannerRef.current?.openModal();
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
      setShowRefillBox(isToggle);
      // We reset the pack state back null,
      //  if switch state is false.
      if (!isToggle) {
        setMedicationpack(null);
        setVersion(version + 1);
      }
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

  // Note text on change fn value
  const handleOnTextChange = (text: string) => {
    if (text.length < 1) {
      setMedicationDetails({ medicationNote: null });
    } else {
      setMedicationDetails({ medicationNote: text });
    }
  };

  // @platform IOS ONLY
  // It control the height for the container when
  //  days reminder picker trigger it goes from HALF_EXPAND to FULL_EXPAND.

  const controlFullExpand = (isPicker: boolean) => {
    refillSettingHeight.value = withSpring(isPicker ? FULL_EXPAND : HALF_EXPAND);
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
        (existingData: MedicationProfileReponse[]) =>
          existingData ? [...existingData, incomingData] : [incomingData],
      );

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["schedule-events"] }),
        queryClient.invalidateQueries({ queryKey: ["medication-packs"] }),
        createScheduleEventNotification({
          ...notfication,
          ...reminderPreferences,
        }),
      ]);

      clearFormState();
      router.dismissAll();
      router.navigate("/");
    },
    onError() {
      showFeedBack({
        title: "Что-то пошло не так!",
        message: "Пожалуйста, проверьте, попробуйте еще раз!",
        status: "error",
      });
    },
  });

  const createMedicationSchedule = async () => {
    // Just incase, user choose to add pack,
    // but they forget to select the day reminder,
    // we remind them about it, by showing and
    // error feedback with message about it.
    if (
      formState.medicationPack &&
      (!formState.medicationPack.reminderDays ||
        Number(formState.medicationPack.totalQuantity) <= Number(formState.schedule.dosage))
    ) {
      showFeedBack({
        title: "Неверный ввод",
        message: "Пожалуйста, введите все данные о вашей упаковке с лекарствами.",
        status: "error",
      });
      return;
    }

    const endDate = formState.schedule.endDate ? formState.schedule.endDate : null;

    const data: CreateMedicationProfile = {
      ...formState,
      schedule: {
        dosage: formState.schedule.dosage,
        recurrenceRule: formState.schedule.rule.recurrenceRule,
        startDate: formState.schedule.startDate,
        endDate,
        timeZone: formState.schedule.timeZone,
      },
    };

    const notifcationAllowed = await NotificationHelper.checkNotificationPermission();

    if (!notifcationAllowed) {
      const allowed = await NotificationHelper.allowsNotifications();
      if (!allowed) {
        Alert.alert("Allow notification for us to create schedules");
        return;
      }
    }

    mutate(data);
  };

  // Themes color
  const color = useThemeColor({}, "textPrimary");
  const colorMuted = useThemeColor({}, "textMuted");
  const backgroundColor = useThemeColor({}, "backgroundPrimary");
  const bGColor = useThemeColor({}, "backgroundSecondary");
  const bGTertiary = useThemeColor({}, "backgroundTertiary");
  const borderColor = useThemeColor({}, "borderColor");
  const tintColor = useThemeColor({}, "tint");

  const top = isIOS ? 0 : insets.top + 10;

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: top, backgroundColor }}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
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

              <Switch
                onValueChange={toggleSwitch}
                value={showRefillBox}
                trackColor={{ false: bGTertiary, true: tintColor }}
                thumbColor="#F7F7F7"
                style={{ alignSelf: "center" }}
              />
            </View>

            <Animated.View
              style={{
                opacity: !isIOS ? pickersWrapperOpacity : undefined,
                pointerEvents: showRefillBox ? "auto" : "none",
              }}
            >
              <MedicationPackPicker
                key={version}
                amountInPack={amountInPack}
                refillDaysReminder={refillDaysReminder}
                onAmountInPackSet={handleAmountInPackSet}
                onRefillDaysReminderSet={handleRefillDaysSet}
                onPickerTrigger={controlFullExpand}
                measurementValue={formState.medicationMeasurement}
              />
            </Animated.View>
          </Animated.View>
        </View>

        {/* Note settings */}
        <View style={sharedStyles.sectionContainer}>
          <Text style={sharedStyles.title}>Заметка</Text>
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
        {/* SUBSCRIPTION OFFER */}
        <SubscriptionBanner ref={openBannerRef} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    gap: 32,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
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
    flex: 1,
    gap: 2,
    alignItems: "flex-start",
    justifyContent: "flex-start",
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
