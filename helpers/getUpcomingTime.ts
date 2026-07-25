import { lng } from "@/i18next/i18next";
import { DateTime } from "@/utils/luxonUtil";

export const getUpcomingTime = (isoDateTime: string, now: DateTime) => {
  if (!isoDateTime) return;

  const scheduleTime = DateTime.fromISO(isoDateTime, {
    locale: lng,
    setZone: true,
  });

  if (!scheduleTime.hasSame(now, "day")) return;

  if (scheduleTime < now) return;

  const upcomingTime = scheduleTime.minus({ hours: now.hour, minutes: now.minute });

  const formatMin = lng === "ru" ? "' 'mm'м'" : "' 'mm'm'";
  const formatHours = lng === "ru" ? "H'ч 'mm'м'" : "H'h 'mm'm'";

  if (upcomingTime.hour <= 0) {
    return upcomingTime.setLocale(lng).toFormat(formatMin);
  }

  return upcomingTime.setLocale(lng).toFormat(formatHours);
};
