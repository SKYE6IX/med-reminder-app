import { MedicationPackResponse } from "@/types/medication";
import { NotificationSettings } from "@/types/notification";
import { DateTime, getTimeZone } from "@/utils/luxonUtil";
import { Alert } from "react-native";
import { NotificationHelper } from "./notification-helper";

interface CreateRefillNotification {
  medicationPack: MedicationPackResponse | undefined;
  settings: Partial<NotificationSettings>;
}

export async function createRefillNotification({
  medicationPack,
  settings,
}: CreateRefillNotification) {
  // Do nothing if no profile is found or
  // user haven't added a pack.
  if (!medicationPack) return;

  const daysSupply = Math.round(
    Number(medicationPack.currentQuantity) / Number(medicationPack.dosageAmount),
  );

  if (daysSupply - 1 < medicationPack.reminderDays) {
    const refillDate = DateTime.now()
      .setZone(getTimeZone())
      .plus({ days: 1 })
      .set({ hour: 9, minute: 0, second: 0, millisecond: 0 })
      .toISO();

    const notifcationAllowed = await NotificationHelper.checkNotificationPermission();
    if (!notifcationAllowed) {
      const allowed = await NotificationHelper.allowsNotifications();
      if (!allowed) {
        Alert.alert("Включите уведомления, чтобы получать оповещения о ваших лекарствах.");
        return;
      }
    }

    const notifications = new NotificationHelper(settings);

    await notifications.scheduleRefillNotification({
      scheduleAt: refillDate ?? "",
      medicationName: medicationPack.medicationName,
      medicationProfileId: medicationPack.medicationProfileId,
    });
  }
}
