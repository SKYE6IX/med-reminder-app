import { MedicationScheduleEvent } from "@/types/medication";
import { NotificationData, NotificationSettings } from "@/types/notification";
import { api, axios } from "@/utils/axiosInstance";
import { DateTime } from "@/utils/luxonUtil";
import notifee, { TriggerNotification } from "react-native-notify-kit";
import { NotificationHelper } from "./notification-helper";
import { saveToStorage } from "./storage-manager";

const MAX_PREBUILD_EVENTS = 10;
const LAST_SCHEDULED_KEY = "notifications:lastScheduledAt";

export const createScheduleEventNotification = async (settings: Partial<NotificationSettings>) => {
  const isoString = DateTime.now().toISO({ precision: "minute" });
  try {
    const response = await api.get<MedicationScheduleEvent[]>("medications/schedules/upcoming", {
      params: {
        eventDateFrom: isoString,
        limit: MAX_PREBUILD_EVENTS,
      },
    });

    if (!response.data.length) return;

    // Inocming events
    const newEvents = response.data;

    // Get all the current pending notification
    const pendingAppNotifications = await notifee.getTriggerNotifications();
    // We get only notifications with notificationType of due, it has all the keys
    // for early, due and missed which hold all the IDs.
    const pendings = pendingAppNotifications.filter((appNotification) => {
      const data = appNotification.notification?.data as unknown as NotificationData;
      return data.notificationType === "due";
    });

    // We cancel all the exisiting events
    if (pendings.length) {
      // Because a due return 3 notification (snoonze), we use the only
      // single unique key, eventID to set them into map.
      const pendingMaps = new Map<string, TriggerNotification>();
      pendings.forEach((pending) => {
        const data = pending.notification?.data as unknown as NotificationData;
        pendingMaps.set(data.dosageScheduleEventId as string, pending);
      });

      await Promise.all(
        [...pendingMaps.values()].map((value) => {
          const data = value.notification.data as unknown as NotificationData;
          return NotificationHelper.removeNotificationsWithKey(data.storageKey as string);
        }),
      );
      pendingMaps.clear();
    }

    const notifications = new NotificationHelper(settings);

    await Promise.all(
      newEvents.map((event) =>
        notifications.scheduleDosageNotification({
          scheduleEventId: event.id,
          medicationName: event.medicationName,
          scheduleAt: event.scheduleAt,
          medicationProfileId: event.medicationProfileId,
        }),
      ),
    );

    const lastEvent = newEvents[newEvents.length - 1];
    await saveToStorage(LAST_SCHEDULED_KEY, lastEvent.scheduleAt);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("An axios error occur in createScheduleEventNotification -> ", error);
    } else {
      console.log("Unknow error occur in createScheduleEventNotification -> ", error);
    }
  }
};
