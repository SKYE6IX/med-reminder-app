import { DateTime } from "@/utils/luxonUtil";

export const getScheduleBadge = (
  scheduleAt: string,
  status: string,
  now: DateTime,
): "upcoming" | "taken" | "missed" | undefined => {
  const scheduleTime = DateTime.fromISO(scheduleAt, {
    locale: "ru",
    setZone: true,
  });
  const upcoming = scheduleTime.hasSame(now, "day");
  const isTimeReached = now >= scheduleTime;

  if (status === "TAKEN") {
    return "taken";
  } else if (status === "MISSED") {
    return "missed";
  } else if (upcoming && !isTimeReached) {
    return "upcoming";
  }
};
