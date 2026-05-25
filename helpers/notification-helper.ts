import {
  NotificationData,
  NotificationSettings,
  ReminderPrefixKey,
  ScheduleAction,
  ScheduleNotificationOptions,
} from "@/types/notification";
import { DateTime, getTimeZone } from "@/utils/luxonUtil";

import { useAppSettingsStore } from "@/stores/app-settings-store";
import { useNotificationDataStore } from "@/stores/notification-data-store";
import { MedicationProfile, MedicationScheduleEvent } from "@/types/medication";
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

    const dueStorageKey = NotificationHelper.createNotificationStorageKey({
      prefix: "due-reminder",
      medProfileId: options.medicationProfileId,
      scheduleAt: options.scheduleAt,
    });

    const earyReminder = dueReminder.minus({ minute: 20 });
    const earlyStorageKey = NotificationHelper.createNotificationStorageKey({
      prefix: "early-reminder",
      medProfileId: options.medicationProfileId,
      scheduleAt: options.scheduleAt,
    });

    const lastSnooze = snoozeReminders[snoozeReminders.length - 1].date;
    const missedReminder = lastSnooze.plus({ minutes: 30 });
    const missedStorageKey = NotificationHelper.createNotificationStorageKey({
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
    const dueDataStoragesKeys = [dueStorageKey, missedStorageKey];
    const dueReminderData: NotificationData = {
      dosageScheduleEventId: options.scheduleEventId,
      storageKey: JSON.stringify(dueDataStoragesKeys),
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

  async scheduleRefillNotification({
    scheduleAt,
    medicationName,
    medicationProfileId,
  }: Omit<ScheduleNotificationOptions, "scheduleEventId">) {
    const date = DateTime.fromISO(scheduleAt).toJSDate();

    // @Platfrom ANDROID ONLY
    const channelId = await this.registerAndroidChannel({
      id: "reminder",
      sound: "universfield_soft.wav",
    });

    const storageKey = NotificationHelper.createNotificationStorageKey({
      prefix: "refill-reminder",
      medProfileId: medicationProfileId,
    });

    const time = date.getTime();
    const title = "Refill Reminder Alert";
    const body = `${medicationName} is about to finished.`;

    const notificationId = await this.createNotification({
      time: time,
      title,
      body,
      channelId,
      showQuickActions: false,
      customData: {
        notificationType: "refill",
        storageKey,
      },
    });

    await saveToStorage(storageKey, notificationId);
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
      if (initialNotification.pressAction.id === "default" && data) {
        await NotificationHelper.removeNotificationsWithKey(data);
      }
    }
  }

  public static handleOnBackgroundEvent() {
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      const { notification, pressAction } = detail;

      const data = notification?.data as unknown as NotificationData;

      if (type === EventType.ACTION_PRESS) {
        if (pressAction?.id === "taken") {
          await NotificationHelper.updateSchdeuleEventsAction(
            "TAKEN",
            data.dosageScheduleEventId ?? "",
          );
        } else if (pressAction?.id === "missed") {
          await NotificationHelper.updateSchdeuleEventsAction(
            "MISSED",
            data.dosageScheduleEventId ?? "",
          );
        }
      }
      await NotificationHelper.removeNotificationsWithKey(data);
      return Promise.resolve();
    });
  }

  public static handleOnForeGroundEvent() {
    return notifee.onForegroundEvent(async ({ type, detail }) => {
      switch (type) {
        case EventType.DISMISSED:
          break;
        case EventType.PRESS:
          const { notification } = detail;
          const data = notification?.data as unknown as NotificationData;
          await NotificationHelper.removeNotificationsWithKey(data);
          break;
      }
    });
  }

  public static createNotificationStorageKey({
    prefix,
    medProfileId,
    scheduleAt,
  }: {
    prefix: ReminderPrefixKey;
    medProfileId: string;
    scheduleAt?: string;
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

  // PRIVATE HELPERS
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

  private static async removeNotificationsWithKey(data: NotificationData) {
    let storageKey: string | string[];

    try {
      storageKey = JSON.parse(data.storageKey as string);
    } catch {
      storageKey = data.storageKey;
    }

    if (typeof storageKey === "object") {
      for (const key of storageKey) {
        const notifcationId = await readFromStorage<string | string[]>(key);

        await NotificationHelper.cancelNotificationWithId(notifcationId, key);
      }
    } else {
      const notifcationId = await readFromStorage<string>(storageKey);

      await NotificationHelper.cancelNotificationWithId(notifcationId, storageKey);
    }
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

  private static async updateSchdeuleEventsAction(action: ScheduleAction, scheduleId: string) {
    try {
      const eventResponse = await api.put<MedicationScheduleEvent>(
        `medications/schedules/event/${scheduleId}`,
        {
          action,
        },
      );
      if (eventResponse.data) {
        useNotificationDataStore.getState().setScheduleData(eventResponse.data, scheduleId);

        const medicationProfilesResponse = await api.get<MedicationProfile[]>("medications");
        if (medicationProfilesResponse.data) {
          const medicationProfile = medicationProfilesResponse.data.find(
            (profile) => profile.id === eventResponse.data.medicationProfileId,
          );

          if (!medicationProfile || medicationProfile.pack == null) return;

          const { currentAmountInPack, reminderDays } = medicationProfile.pack;
          const daysSupply = Math.round(
            Number(currentAmountInPack) / Number(medicationProfile.schedule.dosage),
          );

          if (daysSupply - 1 < reminderDays) {
            const refillDate = DateTime.now()
              .setZone(getTimeZone())
              .plus({ days: 1 })
              .set({ hour: 9, minute: 0, second: 0, millisecond: 0 })
              .toISO();

            const appSettingState = useAppSettingsStore.getState();

            const notifications = new NotificationHelper({
              ...appSettingState.notfication,
              ...appSettingState.reminderPreferences,
            });

            await notifications.scheduleRefillNotification({
              scheduleAt: refillDate ?? "",
              medicationName: medicationProfile.medicationName,
              medicationProfileId: medicationProfile.id,
            });
          }
        }
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
