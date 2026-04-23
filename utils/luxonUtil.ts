import { DateTime, Duration } from "luxon";

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

export const formateDate = (isoDate: string) => {
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

export { DateTime, Duration };
