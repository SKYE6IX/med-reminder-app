import { lng } from "@/i18next/i18next";
import { DateTime, DateTimeFormatOptions, Duration } from "luxon";

export const getTimeZone = () => DateTime.now().zoneName;

export const toLocalUtcTime = (date: Date) => {
  return DateTime.fromJSDate(date)
    .toUTC()
    .setZone("local", { keepLocalTime: true })
    .toJSDate()
    .toLocaleTimeString("ru", {
      formatMatcher: "best fit",
      timeStyle: "short",
    });
};

export const toLocalTime = (date: Date) => {
  return DateTime.fromJSDate(date)
    .setZone(getTimeZone(), { keepLocalTime: true })
    .toJSDate()
    .toLocaleTimeString("ru", {
      formatMatcher: "best fit",
      timeStyle: "short",
    });
};

export const getDateLocalString = (date: Date = new Date()) => {
  return DateTime.fromJSDate(date)
    .toUTC()
    .setZone("local", { keepLocalTime: true })
    .toJSDate()
    .toLocaleDateString("ru-RU");
};

export const formatRegularDate = (isoDate: string) => {
  const date = DateTime.fromFormat(isoDate, "dd MM yyyy", {
    locale: lng,
    setZone: true,
  });

  const today = DateTime.now();
  const tomorrow = today.plus({ days: 1 });

  const toLocaleOptions: DateTimeFormatOptions = {
    month: "long",
    day: "2-digit",
  };

  if (date.hasSame(today, "day")) {
    return "Сегодня";
  }
  if (date.hasSame(tomorrow, "day")) {
    return "Завтра";
  }

  return date.toLocaleString({
    ...toLocaleOptions,
    weekday: "short",
  });
};

export const formatHomeScreenDate = (isoDate: string) => {
  const date = DateTime.fromISO(isoDate, {
    locale: lng,
    setZone: true,
  });

  const now = DateTime.now().setLocale(lng);
  const tomorrow = now.plus({ days: 1 });
  const yesterday = now.minus({ days: 1 });

  const toLocaleOptions: DateTimeFormatOptions = {
    month: "long",
    day: "2-digit",
  };

  const todayText = lng === "ru" ? "сегодня" : "Today";
  const tomorrowText = lng === "ru" ? "завтра" : "Tomorrow";
  const yesterdayText = lng === "ru" ? "вчера" : "Yesterday";

  if (date.hasSame(now, "day")) {
    return `${todayText}, ${now.toLocaleString(toLocaleOptions)}`;
  }
  if (date.hasSame(tomorrow, "day")) {
    return `${tomorrowText}, ${tomorrow.toLocaleString(toLocaleOptions)}`;
  }
  if (date.hasSame(yesterday, "day")) {
    return `${yesterdayText}, ${yesterday.toLocaleString(toLocaleOptions)}`;
  }

  return date.toLocaleString({
    ...toLocaleOptions,
    weekday: "long",
  });
};

export const getWeekDays = (offset: number) => {
  const anchorWeekStart = DateTime.now().setLocale(lng).startOf("week");
  const start = anchorWeekStart.plus({ weeks: offset });
  return Array.from({ length: 7 }, (_, i) => {
    const dt = start.plus({ days: i });
    return {
      date: dt.day,
      day: dt.toLocaleString({ weekday: "short" }),
      fullDay: dt.toLocaleString({ weekday: "long" }),
      iso: dt.toISODate(),
      isToday: dt.hasSame(DateTime.now(), "day"),
    };
  });
};

export const getWeekViewDescription = (isoDate: string) => {
  const date = DateTime.fromISO(isoDate, {
    locale: "ru",
    setZone: true,
  });

  const today = DateTime.now().setLocale("ru");
  const tomorrow = today.plus({ days: 1 });
  const yesterday = today.minus({ days: 1 });

  const toLocaleOptions: DateTimeFormatOptions = {
    month: "long",
    day: "2-digit",
  };

  const todayText = lng === "ru" ? "сегодня" : "Today";
  const tomorrowText = lng === "ru" ? "завтра" : "Tomorrow";
  const yesterdayText = lng === "ru" ? "вчера" : "Yesterday";

  if (date.hasSame(today, "day")) {
    return todayText;
  }
  if (date.hasSame(tomorrow, "day")) {
    return tomorrowText;
  }
  if (date.hasSame(yesterday, "day")) {
    return yesterdayText;
  }
  return date.toLocaleString({
    ...toLocaleOptions,
  });
};

export { DateTime, DateTimeFormatOptions, Duration };
