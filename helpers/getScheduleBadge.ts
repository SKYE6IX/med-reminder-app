import { MedicationScheduleResponse } from "@/types/medication";
import { DateTime, getTimeZone } from "@/utils/luxonUtil";

export const getScheduleBadge = (
  medicationSchedule: MedicationScheduleResponse,
): "upcoming" | "taken" | "missed" | undefined => {
  const now = DateTime.now().setZone(getTimeZone());
  const scheduleTime = DateTime.fromISO(medicationSchedule.scheduleAt, {
    locale: "ru",
    setZone: true,
  });

  const upcoming = scheduleTime.hasSame(now, "day");

  if (medicationSchedule.status === "TAKEN") {
    return "taken";
  } else if (medicationSchedule.status === "MISSED") {
    return "missed";
  } else if (upcoming) {
    return "upcoming";
  }
};
