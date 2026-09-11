import { ScheduleEventResponse } from "@/types/medication";
import { NotificationData, NotificationSettings } from "@/types/notification";
import { api, axios } from "@/utils/axiosInstance";
import { DateTime, getNowISODate } from "@/utils/luxonUtil";
import notifee, { TriggerNotification } from "react-native-notify-kit";
import { NotificationHelper } from "./notification-helper";
import { readFromStorage, removeFromStorage, saveToStorage } from "./storage-manager";

const MAX_PREBUILD_EVENTS = 10;
const LAST_SCHEDULED_KEY = "notifications:lastScheduledAt";

export const scheduleNextMedicationNotifications = async (
  settings: Partial<NotificationSettings>,
) => {
  try {
    // Inspect current pending notifications
    const pendingAppNotifications = await notifee.getTriggerNotifications();
    // We get only notifications with notificationType are due.
    // It's where we store the eventID data.
    const pendings = pendingAppNotifications.filter((appNotification) => {
      const data = appNotification.notification?.data as unknown as NotificationData;
      return data.notificationType === "due";
    });

    const pendingMaps = new Map<string, TriggerNotification>();

    if (pendings.length) {
      // Because a due return 3 notifications(snoonze), we use the only
      // single unique key, eventID to set them into map.
      pendings.forEach((pending) => {
        const data = pending.notification?.data as unknown as NotificationData;
        pendingMaps.set(data.dosageScheduleEventId as string, pending);
      });
    }

    const pendingCount = pendingMaps.size;

    if (pendingCount >= MAX_PREBUILD_EVENTS) {
      return;
    }

    const slotsAvailable = MAX_PREBUILD_EVENTS - pendingCount;

    let anchorDate: string;

    if (pendingCount > 0) {
      const storeDate = await readFromStorage<string>(LAST_SCHEDULED_KEY);

      const isoDate = storeDate
        ? DateTime.fromJSDate(new Date(storeDate)).toISODate({ format: "basic" })
        : null;

      anchorDate = isoDate ?? getNowISODate();
    } else {
      await removeFromStorage(LAST_SCHEDULED_KEY);

      anchorDate = getNowISODate();
    }

    const upcomingEvents = await api.get<ScheduleEventResponse[]>(
      "medications/schedules/event/upcoming",
      {
        params: {
          eventDateFrom: anchorDate,
          limit: slotsAvailable,
        },
      },
    );

    if (!upcomingEvents.data.length) {
      return;
    }

    const events = upcomingEvents.data;
    const newEvents = events.filter((event) => !pendingMaps.has(event.id));

    if (!newEvents.length) {
      return;
    }

    const notifcationAllowed = await NotificationHelper.checkNotificationPermission();

    if (!notifcationAllowed) {
      const allowed = await NotificationHelper.allowsNotifications();
      if (!allowed) {
        return;
      }
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
      console.log("An axios error occur when create a medication -> ", error);
    } else {
      console.log("Unknow error occur when create a medication -> ", error);
    }
  }
};
