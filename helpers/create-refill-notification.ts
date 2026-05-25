import { MedicationProfile } from "@/types/medication";
import { NotificationSettings } from "@/types/notification";
import { DateTime, getTimeZone } from "@/utils/luxonUtil";
import { NotificationHelper } from "./notification-helper";

interface CreateRefillNotification {
  medicationProfile: MedicationProfile | undefined;
  settings: Partial<NotificationSettings>;
}

export async function createRefillNotification({
  medicationProfile,
  settings,
}: CreateRefillNotification) {
  // Do nothing if no profile is found or
  // user haven't added a pack.
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

    const notifications = new NotificationHelper(settings);

    await notifications.scheduleRefillNotification({
      scheduleAt: refillDate ?? "",
      medicationName: medicationProfile.medicationName,
      medicationProfileId: medicationProfile.id,
    });
  }
}
