import { NotificationData } from "@/types/notification";
import notifee, { TriggerNotification } from "react-native-notify-kit";
import { NotificationHelper } from "./notification-helper";
import { readFromStorage } from "./storage-manager";

export async function cancelEventNotification({ medProfileId }: { medProfileId: string }) {
  try {
    const pendingAppNotifications = await notifee.getTriggerNotifications();
    // We get only notifications with notificationType are due.
    // It's where we store the eventID and medProfileId data.
    const pendings = pendingAppNotifications.filter((appNotification) => {
      const data = appNotification.notification.data as unknown as NotificationData;
      return data.notificationType === "due";
    });

    if (!pendings.length) return;

    const pendingMaps = new Map<string, TriggerNotification>();
    pendings.forEach((pending) => {
      const data = pending.notification?.data as unknown as NotificationData;
      pendingMaps.set(data.dosageScheduleEventId as string, pending);
    });

    const eventsToEvict = [...pendingMaps.values()].filter((pending) => {
      const data = pending.notification?.data as unknown as NotificationData;
      return data.medicationProfileId === medProfileId;
    });

    if (!eventsToEvict.length) return;

    await Promise.all(
      eventsToEvict.map((value) => {
        const data = value.notification.data as unknown as NotificationData;
        return NotificationHelper.removeNotificationsWithKey(data);
      }),
    );

    // Check if user has a refill remider set up fro the medication profile
    const refillKey = NotificationHelper.createNotificationStorageKey({
      prefix: "missed-reminder",
      medProfileId,
    });
    const refillNotificationId = await readFromStorage<string>(refillKey);
    if (refillNotificationId) {
      await NotificationHelper.cancelNotificationWithId(refillNotificationId, refillKey);
    }
  } catch (error) {
    console.log("An error occur when from cancel cancelEventNotification -> ", error);
  }
}
