import { DateTime, DateTimeFormatOptions, Duration } from "luxon";

export const getTimeZone = () => DateTime.now().zoneName;

export const getDateLocalString = (date: Date = new Date()) => {
  return DateTime.fromJSDate(date)
    .toUTC()
    .setZone("local", { keepLocalTime: true })
    .toJSDate()
    .toLocaleDateString("ru-RU");
};

export const toLocalTime = (date: Date) => {
  return DateTime.fromJSDate(date, { zone: "utc" })
    .setZone(getTimeZone(), { keepLocalTime: true })
    .toJSDate();
};

export const formatRegularDate = (isoDate: string) => {
  const date = DateTime.fromFormat(isoDate, "dd MM yyyy", {
    locale: "ru-RU",
    setZone: true,
  });
  const today = DateTime.now();
  const tomorrow = today.plus({ days: 1 });

  if (date.hasSame(today, "day")) {
    return "Сегодня";
  }

  if (date.hasSame(tomorrow, "day")) {
    return "Завтра";
  }
  return date.toFormat("MMMM d", { locale: "ru" });
};

export const formatHomeScreenDate = (isoDate: string) => {
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

  if (date.hasSame(today, "day")) {
    return `Сегодня, ${today.toLocaleString(toLocaleOptions)}`;
  }
  if (date.hasSame(tomorrow, "day")) {
    return `Завтра, ${tomorrow.toLocaleString(toLocaleOptions)}`;
  }
  if (date.hasSame(yesterday, "day")) {
    return `Вчера, ${yesterday.toLocaleString(toLocaleOptions)}`;
  }
  return date.toLocaleString({
    ...toLocaleOptions,
    weekday: "long",
  });
};

export const getWeekDays = (date = DateTime.now()) => {
  const current = date.setLocale("ru");

  const startOfWeek = current.minus({ days: current.weekday - 1 });

  return Array.from({ length: 7 }, (_, i) => {
    const dt = startOfWeek.plus({ days: i });

    return {
      date: dt.day,
      day: dt.toLocaleString({ weekday: "short" }),
      fullDay: dt.toLocaleString({ weekday: "long" }),
      iso: dt.toISODate(),
      isToday: dt.hasSame(DateTime.now(), "day"),
    };
  });
};

export { DateTime, Duration };
