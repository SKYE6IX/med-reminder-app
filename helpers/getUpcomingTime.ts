import { DateTime } from "@/utils/luxonUtil";

export const getUpcomingTime = (isoDateTime: string, now: DateTime) => {
  if (!isoDateTime) return;

  const scheduleTime = DateTime.fromISO(isoDateTime, {
    locale: "ru",
    setZone: true,
  });

  if (!scheduleTime.hasSame(now, "day")) return;

  if (scheduleTime < now) return;

  const upcomingTime = scheduleTime.minus({ hours: now.hour, minutes: now.minute });

  if (upcomingTime.hour <= 0) {
    return upcomingTime.setLocale("ru").toFormat("' 'mm'м'");
  }

  return upcomingTime.setLocale("ru").toFormat("H'ч 'mm'м'");
};
