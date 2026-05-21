import {
  NotificationData,
  NotificationSettings,
  ReminderPrefixKey,
  ScheduleAction,
  ScheduleNotificationOptions,
} from "@/types/notification";
import { DateTime } from "@/utils/luxonUtil";

import { useNotificationDataStore } from "@/stores/notification-data-store";
import { MedicationScheduleEvent } from "@/types/medication";
import { api, axios } from "@/utils/axiosInstance";
import notifee, {
  AndroidImportance,
  AndroidVisibility,
  AuthorizationStatus,
  EventType,
  TimestampTrigger,
  TriggerType,
} from "react-native-notify-kit";
import { getScheduleTime } from "./getScheduleTime";
import { readFromStorage, removeFromStorage, saveToStorage } from "./storage-manager";

const DEFAULT_SETTINGS: NotificationSettings = {
  enable: true,
  sound: "enable",
  vibration: true,
  showOnLockScreen: true,
  snoozeDuration: 5,
  earlyReminder: false,
  missedDoseAlert: false,
};

export class NotificationHelper {
  private settings: NotificationSettings;

  constructor(userSettings: Partial<NotificationSettings>) {
    this.settings = { ...DEFAULT_SETTINGS, ...userSettings };
  }

  async scheduleDosageNotification(options: ScheduleNotificationOptions) {
    const MAX_SNOOZE_REPEAT = 3;
    const now = DateTime.now();
    const dueReminder = DateTime.fromISO(options.scheduleAt);

    if (!this.settings.enable || dueReminder < now) return null;

    await NotificationHelper.setCategories();

    const snoozeReminders = Array.from({ length: MAX_SNOOZE_REPEAT }, (_, i) => ({
      date: dueReminder.plus({ minutes: this.settings.snoozeDuration * i }),
      minutesOverdue: this.settings.snoozeDuration * i,
    }));

    const dueStorageKey = NotificationHelper.notificationStorageKey({
      prefix: "due-reminder",
      medProfileId: options.medicationProfileId,
      scheduleAt: options.scheduleAt,
    });

    const earyReminder = dueReminder.minus({ minute: 20 });
    const earlyStorageKey = NotificationHelper.notificationStorageKey({
      prefix: "early-reminder",
      medProfileId: options.medicationProfileId,
      scheduleAt: options.scheduleAt,
    });

    const lastSnooze = snoozeReminders[snoozeReminders.length - 1].date;
    const missedReminder = lastSnooze.plus({ minutes: 30 });
    const missedStorageKey = NotificationHelper.notificationStorageKey({
      prefix: "missed-reminder",
      medProfileId: options.medicationProfileId,
      scheduleAt: options.scheduleAt,
    });

    // @Platfrom ANDROID ONLY
    const channelId = await this.registerAndroidChannel({
      id: "reminder",
      sound: "universfield_soft.wav",
    });

    // We pre define all the notification, so as to achive the
    // snooze behavior type
    const dueReminderData: NotificationData = {
      scheduleId: options.scheduleId,
      dueStorageKey,
      missedStorageKey,
      notificationType: "due",
    };

    const notificationsId = await Promise.all(
      snoozeReminders.map(async (reminder, i) => {
        const time = reminder.date.toJSDate();
        const title = i === 0 ? "Time for medication" : "Reminder snoozed";
        const body =
          i === 0
            ? `Your dose of ${options.medicationName} at ${getScheduleTime(options.scheduleAt)} is due now. Tap to log it or use the quick actions
      `
            : `${options.medicationName} is still waiting to be taken ${reminder.minutesOverdue}м ago. Tap to log it or use the quick actions`;
        return await this.createNotification({
          time: time.getTime(),
          title,
          body,
          channelId,
          customData: dueReminderData,
          showQuickActions: true,
        });
      }),
    );

    // Saved all the key to storage and reused later
    await saveToStorage<string[]>(dueStorageKey, notificationsId);

    // Early reminder set up, if user turn it on;
    if (this.settings.earlyReminder) {
      if (earyReminder > now) {
        const title = "Next Medication In 20м";
        const body = `Your next medication is ${options.medicationName}`;
        const notificationId = await this.createNotification({
          time: earyReminder.toJSDate().getTime(),
          title,
          body,
          channelId,
          showQuickActions: false,
        });
        await saveToStorage<string>(earlyStorageKey, notificationId);
      }
    }

    // Missed dosage reminder set up, if user turn it on;
    if (this.settings.missedDoseAlert) {
      const title = "Missed dose alert";
      const body = `You missed your ${getScheduleTime(options.scheduleAt)} medication. Check with your doctor if you're unsure what to do.`;
      const notifcationId = await this.createNotification({
        time: missedReminder.toJSDate().getTime(),
        title,
        body,
        channelId,
        showQuickActions: false,
      });
      await saveToStorage<string>(missedStorageKey, notifcationId);
    }
  }

  public static async allowsNotificationsAsync() {
    const settings = await notifee.requestPermission();
    if (
      settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
      settings.ios.authorizationStatus === AuthorizationStatus.AUTHORIZED
    ) {
      return true;
    } else {
      return false;
    }
  }

  public static async checkNotificationPermission() {
    const settings = await notifee.getNotificationSettings();
    if (settings.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
      return true;
    } else if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
      return false;
    }
    return false;
  }

  public static async handleOnNotificationOpenApp() {
    const initialNotification = await notifee.getInitialNotification();

    if (initialNotification) {
      const data = initialNotification.notification.data as unknown as NotificationData;
      if (
        initialNotification.pressAction.id === "default" &&
        data &&
        data.notificationType === "due"
      ) {
        //we cancelled all the snooze notification, and if user turn on
        // missed, we cancel too
        const snoozeIds = await readFromStorage<string[]>(data.dueStorageKey as string);
        const missedNoficationId = await readFromStorage<string>(data.missedStorageKey as string);

        await Promise.all([
          NotificationHelper.cancelNotificationWithId(snoozeIds, data.dueStorageKey),
          NotificationHelper.cancelNotificationWithId(missedNoficationId, data.missedStorageKey),
        ]);
      }
    }
  }

  public static handleOnBackgroundEvent() {
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      const { notification, pressAction } = detail;
      const data = notification?.data as unknown as NotificationData;

      if (type === EventType.ACTION_PRESS) {
        if (pressAction?.id === "taken") {
          await NotificationHelper.updateSchdeule("TAKEN", data.scheduleId);
        } else if (pressAction?.id === "missed") {
          await NotificationHelper.updateSchdeule("MISSED", data.scheduleId);
        }
      }

      const snoozeIds = await readFromStorage<string[]>(data?.dueStorageKey as string);
      const missedNoficationId = await readFromStorage<string>(data?.missedStorageKey as string);

      await Promise.all([
        NotificationHelper.cancelNotificationWithId(snoozeIds, data.dueStorageKey),
        NotificationHelper.cancelNotificationWithId(missedNoficationId, data.missedStorageKey),
      ]);

      return Promise.resolve();
    });
  }

  public static notificationStorageKey({
    prefix,
    medProfileId,
    scheduleAt,
  }: {
    prefix: ReminderPrefixKey;
    medProfileId: string;
    scheduleAt: string;
  }) {
    return `${prefix}:${medProfileId}:${scheduleAt}`;
  }

  public static async cancelAllNotifications() {
    await notifee.cancelAllNotifications();
  }

  public static async cancelNotificationWithId(
    notificationId: string | string[] | null,
    storageKey: string,
  ) {
    if (notificationId === null) {
      return;
    }
    if (typeof notificationId === "object") {
      await notifee.cancelAllNotifications(notificationId);
    } else {
      await notifee.cancelNotification(notificationId);
    }
    await removeFromStorage(storageKey);
  }

  private async registerAndroidChannel({ id, sound }: { id: string; sound: string }) {
    const channelId = await notifee.createChannel({
      id,
      name: "MedRemindR",
      vibration: this.settings.vibration,
      importance: AndroidImportance.HIGH,
      visibility: this.settings.showOnLockScreen
        ? AndroidVisibility.PUBLIC
        : AndroidVisibility.SECRET,
      sound: this.settings.sound === "enable" ? sound : undefined,
    });
    return channelId;
  }

  private async createNotification({
    time,
    title,
    body,
    channelId,
    customData,
    showQuickActions,
  }: {
    time: number;
    title: string;
    body: string;
    channelId: string;
    customData?: NotificationData;
    showQuickActions: boolean;
  }) {
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: time,
    };

    return await notifee.createTriggerNotification(
      {
        title,
        body,
        android: {
          channelId: channelId,
          ...(showQuickActions && {
            actions: [
              { title: "Taken", pressAction: { id: "taken" } },
              {
                title: "Skip",
                pressAction: {
                  id: "missed",
                },
              },
            ],
          }),
        },
        ios: {
          interruptionLevel: "timeSensitive",
          sound: "universfield_soft.wav",
          foregroundPresentationOptions: {
            sound: this.settings.sound === "enable",
            list: this.settings.showOnLockScreen,
          },
          ...(showQuickActions && { categoryId: "due-reminder" }),
        },
        ...(customData && {
          data: {
            ...customData,
          },
        }),
      },
      trigger,
    );
  }

  private static async setCategories() {
    await notifee.setNotificationCategories([
      {
        id: "due-reminder",
        actions: [
          {
            id: "taken",
            title: "Taken",
          },
          {
            id: "missed",
            title: "Skip",
          },
        ],
      },
    ]);
  }

  private static async updateSchdeule(action: ScheduleAction, scheduleId: string) {
    try {
      const response = await api.put<MedicationScheduleEvent>(
        `medications/schedules/event/${scheduleId}`,
        {
          action,
        },
      );
      if (response.data) {
        useNotificationDataStore.getState().setScheduleData(response.data, scheduleId);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("An axios error occur when updating schedule event -> ", error);
      } else {
        console.log("An Unknown error occur when updating schedule event -> ", error);
      }
      return null;
    }
  }
}
