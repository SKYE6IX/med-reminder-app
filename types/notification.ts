export type ReminderPrefixKey =
  | "due-reminder"
  | "early-reminder"
  | "missed-reminder"
  | "refill-reminder";

export type NotificationSoundMode = "enable" | "silent";

export type ScheduleAction = "TAKEN" | "MISSED";

// In minutes
export type SnoozeDuration = 5 | 10 | 15;

export interface NotificationSettings {
  enable: boolean;
  sound: NotificationSoundMode;
  vibration: boolean; //@Platform ANDROID ONLY
  showOnLockScreen: boolean;
  snoozeDuration: SnoozeDuration;
  earlyReminder: boolean;
  missedDoseAlert: boolean;
}

export interface ScheduleNotificationOptions {
  medicationName: string;
  scheduleAt: string;
  scheduleEventId: string;
  medicationProfileId: string;
}
export interface NotificationData {
  dosageScheduleEventId?: string;
  storageKey: string | string[];
  notificationType: "due" | "early" | "missed" | "refill";
}
