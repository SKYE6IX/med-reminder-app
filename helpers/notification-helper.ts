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
import { MedicationPackResponse, MedicationScheduleEventResponse } from "@/types/medication";
import { api, axios } from "@/utils/axiosInstance";
import notifee, {
  AlarmType,
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
  alertSound: "universfield_soft.wav",
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

    if (!this.settings.enable || dueReminder < now) return;

    // @Platfrom ANDROID ONLY
    const channelId = await this.registerAndroidChannel({
      id: "due-notification-reminder",
      alertSound: this.settings.alertSound,
    });

    await NotificationHelper.setIOSCategories();

    // Composition of all snoozes
    const snoozeReminders = Array.from({ length: MAX_SNOOZE_REPEAT }, (_, i) => ({
      date: dueReminder.plus({ minutes: this.settings.snoozeDuration * i }),
      minutesOverdue: this.settings.snoozeDuration * i,
    }));

    // Storages keys
    const dueStorageKey = NotificationHelper.createNotificationStorageKey({
      prefix: "due-reminder",
      medProfileId: options.medicationProfileId,
      scheduleAt: options.scheduleAt,
    });
    const earlyStorageKey = NotificationHelper.createNotificationStorageKey({
      prefix: "early-reminder",
      medProfileId: options.medicationProfileId,
      scheduleAt: options.scheduleAt,
    });
    const missedStorageKey = NotificationHelper.createNotificationStorageKey({
      prefix: "missed-reminder",
      medProfileId: options.medicationProfileId,
      scheduleAt: options.scheduleAt,
    });

    const eventNotificationKeys = [dueStorageKey, earlyStorageKey, missedStorageKey];

    // Snooozes data(due notification) hold all the keys for early and missed
    // notifications id
    const dueReminderData: NotificationData = {
      dosageScheduleEventId: options.scheduleEventId,
      medicationProfileId: options.medicationProfileId,
      storageKey: JSON.stringify(eventNotificationKeys),
      notificationType: "due",
      scheduleAt: options.scheduleAt,
    };

    // We pre define all the notification, so as to achive the
    // snooze behavior type
    const notificationsId = await Promise.all(
      snoozeReminders.map(async (reminder, i) => {
        const time = reminder.date.toJSDate();
        const title = i === 0 ? "Пора принять лекарство" : "Напоминание о приёме";
        const body =
          i === 0
            ? `Сейчас время принять ${options.medicationName}, запланированное на ${getScheduleTime(options.scheduleAt)}. Нажмите, чтобы отметить приём или воспользуйтесь быстрыми действиями.
      `
            : `Вы ещё не отметили приём ${options.medicationName}, запланированный ${reminder.minutesOverdue}мин назад. Нажмите, чтобы отметить приём или воспользуйтесь быстрыми действиями.`;
        return await this.createNotificationTrigger({
          time: time.getTime(),
          title,
          body,
          channelId,
          customData: dueReminderData,
          showQuickActions: true,
        });
      }),
    );

    // Saved all snoonze notification ID to storage.
    await saveToStorage<string[]>(dueStorageKey, notificationsId);
    // Early reminder set up, if user turn it on;
    // An early reminder set up
    const earyReminder = dueReminder.minus({ minute: 20 });
    if (this.settings.earlyReminder) {
      if (earyReminder > now) {
        const title = "Следующее лекарство через 20 минут";
        const body = `Следующее лекарство: ${options.medicationName}`;
        const notificationId = await this.createNotificationTrigger({
          time: earyReminder.toJSDate().getTime(),
          title,
          body,
          channelId,
          showQuickActions: false,
          customData: {
            storageKey: earlyStorageKey,
            notificationType: "early",
            scheduleAt: earyReminder.toISO({ precision: "minute" }) ?? "",
          },
        });
        await saveToStorage<string>(earlyStorageKey, notificationId);
      }
    }

    // Missed dosage reminder set up, if user turn it on;
    // Missed pills reminder set up
    const lastSnooze = snoozeReminders[snoozeReminders.length - 1].date;
    const missedReminder = lastSnooze.plus({ minutes: 30 });
    if (this.settings.missedDoseAlert) {
      const title = "Пропущен приём лекарства";
      const body = `Лекарство на ${getScheduleTime(options.scheduleAt)} не было принято. Если у вас есть сомнения по поводу дальнейших действий, проконсультируйтесь с врачом.`;
      const notifcationId = await this.createNotificationTrigger({
        time: missedReminder.toJSDate().getTime(),
        title,
        body,
        channelId,
        showQuickActions: false,
        customData: {
          storageKey: missedStorageKey,
          notificationType: "missed",
          scheduleAt: missedReminder.toISO({ precision: "minute" }) ?? "",
        },
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
      id: "refill-notification-reminder",
      alertSound: this.settings.alertSound,
    });

    const storageKey = NotificationHelper.createNotificationStorageKey({
      prefix: "refill-reminder",
      medProfileId: medicationProfileId,
    });

    const time = date.getTime();
    const title = "Напоминание о пополнении";
    const body = `${medicationName} скоро закончится.`;
    const notificationId = await this.createNotificationTrigger({
      time: time,
      title,
      body,
      channelId,
      showQuickActions: false,
      customData: {
        notificationType: "refill",
        storageKey,
        scheduleAt,
        medicationProfileId,
      },
    });

    await saveToStorage(storageKey, notificationId);
  }

  // CHECK FOR PERMISSION
  public static async checkNotificationPermission() {
    const settings = await notifee.getNotificationSettings();
    if (
      settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
      settings.ios.authorizationStatus === AuthorizationStatus.AUTHORIZED
    ) {
      return true;
    } else if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
      return false;
    }
    return false;
  }

  // REQUEST PERMISSION
  public static async allowsNotifications() {
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

  // A CALLBACK IF NOTIFICATION OPEN THE APP
  public static async handleOnNotificationOpenApp() {
    const initialNotification = await notifee.getInitialNotification();
    if (initialNotification) {
      const data = initialNotification.notification.data as unknown as NotificationData;
      if (initialNotification.pressAction.id === "default" && data) {
        await NotificationHelper.removeNotificationsWithKey(data.storageKey as string);
      }
    }
  }

  // A CALLBACK TO HANDLE BACKGROUND EVENTS OF NOTIFICATIONS
  public static handleOnBackgroundEvent() {
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      const { notification, pressAction } = detail;
      const data = notification?.data as unknown as NotificationData;
      try {
        if (type === EventType.ACTION_PRESS) {
          if (pressAction?.id === "taken") {
            await NotificationHelper.updateSchdeuleEventsAction(
              "TAKEN",
              data.dosageScheduleEventId,
            );
            await NotificationHelper.removeNotificationsWithKey(data.storageKey as string);
          } else if (pressAction?.id === "missed") {
            await NotificationHelper.updateSchdeuleEventsAction(
              "MISSED",
              data.dosageScheduleEventId,
            );
            await NotificationHelper.removeNotificationsWithKey(data.storageKey as string);
          }
        }
        return Promise.resolve();
      } catch (error) {
        console.log("An error occur inisde the background event: ", error);
      }
    });
  }

  // A CALLBACK THAT HANDLE WHEN USER IS CURRENTLY USING THE APP
  // WHEN THE NOTIFICATION COME ON.
  public static handleOnForeGroundEvent() {
    return notifee.onForegroundEvent(async ({ type, detail }) => {
      switch (type) {
        case EventType.DISMISSED:
          // Do nothing with the notifcaton if use dismiss it
          break;
        case EventType.PRESS:
          const { notification } = detail;
          const data = notification?.data as unknown as NotificationData;
          await NotificationHelper.removeNotificationsWithKey(data.storageKey as string);
          break;
      }
    });
  }

  // GENERATE KEY STORAGE USED TO SAVED ALL NOTIFICATION
  // IDs
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

  // CANCEL ALL NOTIFICATION ON THE APP
  public static async cancelAllNotifications() {
    await notifee.cancelAllNotifications();
  }

  // CANCEL NOTIFICATION USING THE ID
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

  public static async removeNotificationsWithKey(key: string) {
    if (!key) return;

    let storageKey: string | string[];
    try {
      storageKey = JSON.parse(key);
    } catch {
      storageKey = key;
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

  // PRIVATE HELPERS
  private async registerAndroidChannel({ id, alertSound }: { id: string; alertSound: string }) {
    const androidSound = alertSound.replace(/\.[^/.]+$/, "");
    const channelId = await notifee.createChannel({
      id,
      name: "MedRemindR",
      vibration: this.settings.vibration,
      importance: AndroidImportance.HIGH,
      visibility: this.settings.showOnLockScreen
        ? AndroidVisibility.PUBLIC
        : AndroidVisibility.SECRET,
      ...(this.settings.sound === "enable" && { sound: androidSound }),
    });
    return channelId;
  }

  private async createNotificationTrigger({
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
      alarmManager: {
        type: AlarmType.SET_ALARM_CLOCK,
      },
    };

    return await notifee.createTriggerNotification(
      {
        title,
        body,
        android: {
          channelId: channelId,
          pressAction: {
            id: "default",
          },
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
          foregroundPresentationOptions: {
            sound: this.settings.sound === "enable",
            list: this.settings.showOnLockScreen,
          },
          ...(this.settings.sound === "enable" && { sound: this.settings.alertSound }),
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

  private static async setIOSCategories() {
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

  private static async updateSchdeuleEventsAction(
    action: ScheduleAction,
    scheduleId: string | undefined,
  ) {
    if (!scheduleId) return;
    try {
      const eventResponse = await api.put<MedicationScheduleEventResponse>(
        `medications/schedules/event/${scheduleId}`,
        {
          action,
        },
      );
      if (eventResponse.data) {
        useNotificationDataStore.getState().setScheduleData(eventResponse.data, scheduleId);
        const medicationPacks = await api.get<MedicationPackResponse[]>("medications/packs");
        if (medicationPacks.data) {
          const activePack = medicationPacks.data.find((pack) => {
            return (
              pack.medicationProfileId === eventResponse.data.medicationProfileId &&
              pack.status === "ACTIVE"
            );
          });
          if (!activePack) return;
          const daysSupply = Math.round(
            Number(activePack.currentQuantity) / Number(activePack.dosageAmount),
          );
          if (daysSupply - 1 < activePack.reminderDays) {
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
              medicationName: activePack.medicationName,
              medicationProfileId: activePack.medicationProfileId,
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
