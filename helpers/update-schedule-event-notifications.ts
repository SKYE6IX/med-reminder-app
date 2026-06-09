import { MedicationProfile } from "@/types/medication";
import { NotificationData, NotificationSettings } from "@/types/notification";
import { queryClient } from "@/utils/query-client";
import notifee from "react-native-notify-kit";
import { NotificationHelper } from "./notification-helper";
import { createScheduleEventNotification } from "./schedule-new-event-notifications";

export const updateScheduleEventNotifications = async (settings: Partial<NotificationSettings>) => {
  try {
    const pendingAppNotifications = await notifee.getTriggerNotifications();
    const refillPending = pendingAppNotifications.find((appNotification) => {
      const data = appNotification.notification?.data as unknown as NotificationData;
      return data.notificationType === "refill";
    });

    // Nuke all existing notifications
    await NotificationHelper.cancelAllNotifications();

    // Create a new notification for pills with the updated settings
    await createScheduleEventNotification(settings);

    // Check if refillPending exist
    if (refillPending) {
      const notifications = new NotificationHelper(settings);
      const data = refillPending.notification.data as unknown as NotificationData;
      const medicationProfile = queryClient
        .getQueryState<MedicationProfile[]>(["medication-profile", "list"])
        ?.data?.find((profile) => profile.id === data.medicationProfileId);

      if (medicationProfile) {
        await notifications.scheduleRefillNotification({
          scheduleAt: data.scheduleAt,
          medicationName: medicationProfile.medicationName,
          medicationProfileId: medicationProfile.id,
        });
      }
    }
  } catch (error) {
    console.log("An error occur in updateScheduleEventNotifications -> ", error);
  }
};
