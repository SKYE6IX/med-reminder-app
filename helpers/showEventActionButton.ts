import { DateTime } from "@/utils/luxonUtil";

export const showEventActionButton = (scheduleAt: string, status: string, now: DateTime) => {
  if (!scheduleAt) {
    return false;
  }

  const scheduleTime = DateTime.fromISO(scheduleAt, {
    locale: "ru",
    setZone: true,
  });

  const isSameDay = now.hasSame(scheduleTime, "day");
  const isTimeReached = now >= scheduleTime;

  return isSameDay && isTimeReached && !["TAKEN", "MISSED"].includes(status);
};
