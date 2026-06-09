import PlusIcon from "@/component/icons/plus-icon";
import CustomButton from "@/component/ui/custom-button/custom-button";
import Loader from "@/component/ui/loader";
import Tabs from "@/component/ui/tabs";
import WeekView from "@/component/ui/week-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useUserData } from "@/hooks/use-user-data";
import { MedicationProfile, MedicationScheduleEvent } from "@/types/medication";
import { getDateLocalString } from "@/utils/luxonUtil";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import ScheduleEventCard from "@/component/ui/cards/schedule-event-card";
import SubscriptionBanner, { SubscriptionBannerRef } from "@/component/ui/subscription-banner";
import { createRefillNotification } from "@/helpers/create-refill-notification";
import { useNotificationData } from "@/hooks/use-notification-data";
import { useProfileImage } from "@/hooks/use-profile-image";
import { useAppSettingsStore } from "@/stores/app-settings-store";
import { useFeedBackStore } from "@/stores/feedback-store";
import { useUserStore } from "@/stores/use-user-store";
import { api, axios } from "@/utils/axiosInstance";
import { queryClient } from "@/utils/query-client";
import { useMutation, useQuery } from "@tanstack/react-query";

type TABS_VALUE = "ALL" | "TAKEN" | "MISSED";

interface UpdateScheduleEvent {
  id: string;
  action: "TAKEN" | "MISSED";
}

const TABS = [
  { label: "Все", value: "ALL" },
  { label: "Принято", value: "TAKEN" },
  { label: "Пропущено", value: "MISSED" },
];

// Fetch schedule events query
const fetchScheduleEvents = async (params: string) => {
  const response = await api.get<MedicationScheduleEvent[]>("medications/schedules/event", {
    params: {
      eventDate: params,
    },
  });
  return response.data;
};

// Update schedule events
const updateScheduleEventMutaion = async (data: UpdateScheduleEvent) => {
  const response = await api.put<MedicationScheduleEvent>(
    `medications/schedules/event/${data.id}`,
    {
      action: data.action,
    },
  );
  return response.data;
};

const localDateString = getDateLocalString();

export default function Home() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { user } = useUserData();
  const { showFeedBack } = useFeedBackStore();
  const { notfication, reminderPreferences } = useAppSettingsStore();
  const profileImageUrl = useProfileImage();

  const [activeTab, setActiveTab] = useState<TABS_VALUE>("ALL");
  const [selectedDate, setSelectedDate] = useState(localDateString);
  const subscriptionBannerRef = useRef<SubscriptionBannerRef>(null);

  // Show premimum plan offer to user
  useEffect(() => {
    let id: number;
    if (useUserStore.getState().displaySubscriptioOffer) {
      id = setTimeout(() => {
        subscriptionBannerRef.current?.toggleBanner();
        useUserStore.getState().updateSubscriptionOffer();
      }, 2000);
    }
    return () => clearTimeout(id);
  }, []);

  // Query schedule event list
  const { data, isLoading } = useQuery({
    queryKey: ["schedule-events", selectedDate],
    queryFn: () => fetchScheduleEvents(selectedDate),
  });

  // When the screen focus back, we track the data that get update
  // base on user action from the notification data centre
  // Right now we only focus on Schedule Events
  useNotificationData({ selectedDate });

  // Update schedule event
  const { isPending, mutate } = useMutation({
    mutationFn: updateScheduleEventMutaion,
    async onSuccess(data, variables) {
      queryClient.setQueryData(
        ["schedule-events", selectedDate],
        (existingData: MedicationScheduleEvent[]) =>
          existingData.map((scheduleEvent) =>
            scheduleEvent.id === variables.id ? data : scheduleEvent,
          ),
      );

      // Inavlidate
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["medication-profile", "list"] }),
        queryClient.invalidateQueries({ queryKey: ["medication-refill-packs"] }),
      ]);

      // Here we get the latest data from medication profile list,
      // we passed it down to refill notification, which will
      // check if user has a pack to refill, and if their refill
      // is near.
      const medicationProfile = queryClient
        .getQueryState<MedicationProfile[]>(["medication-profile", "list"])
        ?.data?.find((profile) => profile.id === data.medicationProfileId);
      await createRefillNotification({
        medicationProfile,
        settings: { ...notfication, ...reminderPreferences },
      });
    },

    onError(error) {
      if (axios.isAxiosError(error)) {
        console.log("An axios error occur when updating schedule event -> ", error);
      } else {
        console.log("An Unknown error occur when updating schedule event -> ", error);
      }
      showFeedBack({
        title: "Ошибка!",
        message: "Что-то пошло не так. Пожалуйста, попробуйте снова.",
        status: "error",
      });
    },
  });

  const hasScheduleEvents = data && data.length >= 1 ? true : false;

  const filterScheduleEvents = useMemo(() => {
    if (activeTab === "ALL") {
      return data?.sort((a, b) => {
        const aIsDone = a.status === "TAKEN" || a.status === "MISSED";
        const bIsDone = b.status === "TAKEN" || b.status === "MISSED";

        if (aIsDone && !bIsDone) return 1;
        if (!aIsDone && bIsDone) return -1;

        const dateA = new Date(a.scheduleAt);
        const dateB = new Date(b.scheduleAt);

        const sortA = dateA.getHours() * 60 + dateA.getMinutes();
        const sortB = dateB.getHours() * 60 + dateB.getMinutes();

        return sortA - sortB;
      });
    } else {
      return data?.filter((med) => med.status === activeTab);
    }
  }, [activeTab, data]);

  const handleOnTabChange = (tab: TABS_VALUE) => {
    setActiveTab(tab);
  };

  const handleOnDateChange = (ISODate: string) => {
    const date = new Date(ISODate);
    const toLocalDateString = getDateLocalString(date);
    setSelectedDate(toLocalDateString);
  };

  // Themes
  const color = useThemeColor({}, "textPrimary");
  const mutedColor = useThemeColor({}, "textMuted");
  const bgPrimary = useThemeColor({}, "backgroundPrimary");

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgPrimary }]} edges={["top"]}>
      <Loader visible={isLoading || isPending} />
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerProfileContainer}>
            <Image
              source={profileImageUrl}
              style={styles.headerAvatar}
              contentFit="cover"
              contentPosition="top center"
            />
          </View>
          <Text style={[styles.headerProfileName, { color }]}>{user?.name}</Text>
        </View>

        {/* WEEK VIEW */}
        <View style={styles.weekViewWrapper}>
          <WeekView showDescription={hasScheduleEvents} onDateChange={handleOnDateChange} />
        </View>

        {/* CONTENT BODY */}
        {!isLoading && (
          <>
            {hasScheduleEvents ? (
              <View style={{ flex: 1 }}>
                <View style={styles.tabsWrapper}>
                  <Tabs tabs={TABS} onTabChange={(tab) => handleOnTabChange(tab as TABS_VALUE)} />
                </View>
                <FlatList
                  style={{ flex: 1 }}
                  data={filterScheduleEvents}
                  // extraData={onFocusTrigger}
                  renderItem={({ item }) => (
                    <ScheduleEventCard
                      key={item.id}
                      scheduleEvent={item}
                      onActionBtnPress={(action) => mutate({ id: item.id, action })}
                    />
                  )}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={[
                    styles.listContentContainer,
                    { paddingBottom: insets.bottom + 10 },
                  ]}
                />
              </View>
            ) : (
              <View style={styles.noContentWrapper}>
                <Image
                  source={require("@/assets/images/pill-bottle.png")}
                  style={styles.noContentImage}
                />
                <Text style={[styles.noContentTitle, { color }]}>
                  На этот день лекарства не запланированы
                </Text>
                <Text style={[styles.noContentSubtitle, { color: mutedColor }]}>
                  Если вы ещё не добавили лекарство, сделайте это сейчас.
                </Text>

                <CustomButton
                  label="Добавить лекарства"
                  svgIcon={<PlusIcon size={15} />}
                  onPress={() => router.navigate("/(tabs)/add-medication")}
                />
              </View>
            )}
          </>
        )}
      </View>

      <SubscriptionBanner ref={subscriptionBannerRef} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    gap: 32,
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  headerProfileContainer: {
    width: 45,
    height: 45,
    borderRadius: 9999,
    overflow: "hidden",
  },
  headerAvatar: {
    width: "100%",
    height: "100%",
  },
  headerProfileName: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    lineHeight: 19.2,
  },
  weekViewWrapper: {
    paddingLeft: 20,
    paddingRight: 20,
    height: 130,
  },
  noContentWrapper: {
    flex: 1,
    gap: 20,
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
  },
  noContentImage: {
    width: 160,
    height: 160,
  },
  noContentTitle: {
    width: 250,
    fontFamily: "Roboto_500Medium",
    fontSize: 20,
    lineHeight: 24,
    textAlign: "center",
  },
  noContentSubtitle: {
    width: 250,
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
    lineHeight: 16.2,
    textAlign: "center",
  },
  tabsWrapper: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  listContentContainer: {
    paddingTop: 16,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 16,
    gap: 16,
  },
});
