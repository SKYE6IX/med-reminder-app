import { MedicationScheduleEvent } from "@/types/medication";
import { getDateLocalString } from "@/utils/luxonUtil";
import { queryClient } from "@/utils/query-client";
import { NotificationHelper } from "./notification-helper";
import { readFromStorage } from "./storage-manager";

export async function cancelScheduleEventNotifications({ medProfileId }: { medProfileId: string }) {
  const localDateString = getDateLocalString();

  //First we get the all notification schedule of the day;
  const response = queryClient.getQueryState<MedicationScheduleEvent[]>([
    "schedule-events",
    localDateString,
  ]);

  //   We do nothing if there are not notification schedule for
  //    this day.
  if (!response?.data) {
    return;
  }

  //   Next we filter out only the notification event that belongs
  //  the medProfileId.
  const filterNotificationEvents = response.data.filter(
    (event) => event.medicationProfileId === medProfileId,
  );

  // It possible that this is empty base on user schedules.
  //   so if empty we do nothing also
  if (filterNotificationEvents.length < 1) {
    return;
  }

  const scheduleNotifications = await Promise.all(
    filterNotificationEvents.map(async (event) => {
      const dueKey = NotificationHelper.createNotificationStorageKey({
        prefix: "due-reminder",
        medProfileId,
        scheduleAt: event.scheduleAt,
      });
      const earlyKey = NotificationHelper.createNotificationStorageKey({
        prefix: "early-reminder",
        medProfileId,
        scheduleAt: event.scheduleAt,
      });
      const missedKey = NotificationHelper.createNotificationStorageKey({
        prefix: "missed-reminder",
        medProfileId,
        scheduleAt: event.scheduleAt,
      });

      const refillKey = NotificationHelper.createNotificationStorageKey({
        prefix: "missed-reminder",
        medProfileId,
      });

      const dueNotificationIds = await readFromStorage<string[]>(dueKey);
      const earlyNotificationId = await readFromStorage<string>(earlyKey);
      const missedNotificationId = await readFromStorage<string>(missedKey);
      const refillNotificationId = await readFromStorage<string>(refillKey);

      return {
        keys: { dueKey, earlyKey, missedKey, refillKey },
        notificationIds: {
          dueNotificationIds,
          earlyNotificationId,
          missedNotificationId,
          refillNotificationId,
        },
      };
    }),
  );

  try {
    await Promise.all(
      scheduleNotifications.map((sn) => {
        NotificationHelper.cancelNotificationWithId(
          sn.notificationIds.dueNotificationIds,
          sn.keys.dueKey,
        );
        NotificationHelper.cancelNotificationWithId(
          sn.notificationIds.earlyNotificationId,
          sn.keys.earlyKey,
        );
        NotificationHelper.cancelNotificationWithId(
          sn.notificationIds.missedNotificationId,
          sn.keys.missedKey,
        );
        NotificationHelper.cancelNotificationWithId(
          sn.notificationIds.refillNotificationId,
          sn.keys.refillKey,
        );
      }),
    );
  } catch (error) {
    console.log("An error occur inside cancelNotifications -> ", error);
  }
}
