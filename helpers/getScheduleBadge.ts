import { MedicationSchedule } from "@/types/medication";
import { DateTime, getTimeZone } from "@/utils/luxonUtil";

export const getScheduleBadge = (
  medicationSchedule: MedicationSchedule,
): "upcoming" | "taken" | "missed" | undefined => {
  const now = DateTime.now().setZone(getTimeZone());
  const scheduleTime = DateTime.fromISO(medicationSchedule.scheduleAt, {
    locale: "ru",
    setZone: true,
  });
  const upcoming = scheduleTime.hasSame(now, "day");
  const isTimeReached = now >= scheduleTime;

  if (medicationSchedule.status === "TAKEN") {
    return "taken";
  } else if (medicationSchedule.status === "MISSED") {
    return "missed";
  } else if (upcoming && !isTimeReached) {
    return "upcoming";
  }
};
