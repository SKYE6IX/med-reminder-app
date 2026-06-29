import { createRefillNotification } from "@/helpers/create-refill-notification";
import { NotificationHelper } from "@/helpers/notification-helper";
import { useAppSettingsStore } from "@/stores/app-settings-store";
import { useFeedBackStore } from "@/stores/feedback-store";
import { MedicationProfile, MedicationScheduleEvent } from "@/types/medication";
import { NotificationData } from "@/types/notification";
import { api } from "@/utils/axiosInstance";
import { queryClient } from "@/utils/query-client";
import { useMutation } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import notifee from "react-native-notify-kit";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScheduleEventCard from "./cards/schedule-event-card";
import Loader from "./loader";
import Tabs from "./tabs";

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

const updateScheduleEventMutaion = async (data: UpdateScheduleEvent) => {
  const response = await api.put<MedicationScheduleEvent>(
    `medications/schedules/event/${data.id}`,
    {
      action: data.action,
    },
  );
  return response.data;
};
const cancelEventNotifications = async (eventId: string) => {
  const pendingAppNotifications = await notifee.getTriggerNotifications();
  const eventToCancel = pendingAppNotifications.find((appNotification) => {
    const data = appNotification.notification.data as unknown as NotificationData;
    return data.dosageScheduleEventId === eventId;
  });
  const notificationData = eventToCancel?.notification.data as unknown as NotificationData;
  await NotificationHelper.removeNotificationsWithKey(notificationData.storageKey as string);
};

export default function ScheduleEventList({
  data,
  selectedDate,
}: {
  data: MedicationScheduleEvent[];
  selectedDate: string;
}) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TABS_VALUE>("ALL");

  const { showFeedBack } = useFeedBackStore();
  const { notfication, reminderPreferences } = useAppSettingsStore();

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
        cancelEventNotifications(data.id),
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
      showFeedBack({
        title: "Ошибка!",
        message: "Что-то пошло не так. Пожалуйста, попробуйте снова.",
        status: "error",
      });
    },
  });

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.tabsWrapper}>
        <Tabs tabs={TABS} onTabChange={(tab) => handleOnTabChange(tab as TABS_VALUE)} />
      </View>

      <FlatList
        style={{ flex: 1 }}
        data={filterScheduleEvents}
        renderItem={({ item }) => (
          <ScheduleEventCard
            key={item.id}
            scheduleEvent={item}
            onActionBtnPress={(action) => mutate({ id: item.id, action })}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContentContainer, { paddingBottom: insets.bottom + 10 }]}
      />
      <Loader visible={isPending} />
    </View>
  );
}

const styles = StyleSheet.create({
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
