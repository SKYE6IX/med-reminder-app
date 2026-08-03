import { DateTime, DateTimeFormatOptions, Duration } from "luxon";

export const getTimeZone = () => DateTime.now().zoneName;

export const getDefaultISODate = () => DateTime.now().toISODate({ format: "basic" });

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

export const formatRegularDate = (isoDate: string, lng: string) => {
  if (!isoDate) return;

  const isRU = lng === "ru";

  const date = DateTime.fromFormat(isoDate, "yyyyMMdd", {
    locale: lng,
    setZone: true,
  });

  const today = DateTime.now();
  const tomorrow = today.plus({ days: 1 });

  const toLocaleOptions: DateTimeFormatOptions = {
    month: "long",
    day: "2-digit",
  };

  const todayText = isRU ? "Сегодня" : "Today";
  const tomorrowText = isRU ? "Завтра" : "Tomorrow";

  if (date.hasSame(today, "day")) {
    return todayText;
  }

  if (date.hasSame(tomorrow, "day")) {
    return tomorrowText;
  }
  return date.toLocaleString({
    ...toLocaleOptions,
    weekday: "short",
  });
};

export const formatHomeScreenDate = (isoDate: string, lng: string) => {
  const isRU = lng === "ru";
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

  const todayText = isRU ? "сегодня" : "Today";
  const tomorrowText = isRU ? "завтра" : "Tomorrow";
  const yesterdayText = isRU ? "вчера" : "Yesterday";

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

export const getWeekDays = (offset: number, lng: string) => {
  const anchorWeekStart = DateTime.now().setLocale(lng).startOf("week");
  const start = anchorWeekStart.plus({ weeks: offset });
  return Array.from({ length: 7 }, (_, i) => {
    const dt = start.plus({ days: i });
    return {
      date: dt.day,
      day: dt.toLocaleString({ weekday: "short" }),
      fullDay: dt.toLocaleString({ weekday: "long" }),
      iso: dt.toISODate({ format: "basic" }),
      isToday: dt.hasSame(DateTime.now(), "day"),
    };
  });
};

export const getWeekViewDescription = (isoDate: string, lng: string) => {
  const isRU = lng === "ru";
  const date = DateTime.fromISO(isoDate, {
    locale: lng,
    setZone: true,
  });

  const today = DateTime.now().setLocale(lng);
  const tomorrow = today.plus({ days: 1 });
  const yesterday = today.minus({ days: 1 });

  const toLocaleOptions: DateTimeFormatOptions = {
    month: "long",
    day: "2-digit",
  };

  const todayText = isRU ? "сегодня" : "Today";
  const tomorrowText = isRU ? "завтра" : "Tomorrow";
  const yesterdayText = isRU ? "вчера" : "Yesterday";

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
