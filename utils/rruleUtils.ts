import { CustomPattern } from "@/component/ui/custom-frequency/types";
import { Options, RRule } from "rrule";
import { DateTime, getTimeZone, toLocalUtcTime } from "./luxonUtil";

export const generateTimeOccurrences = ({ rrule }: { rrule: string }) => {
  const rule = RRule.fromString(rrule);

  const ruleWithMaxCount = new RRule({
    ...rule.options,
    count: rule.options.byhour?.length ?? 1,
  });

  const times = ruleWithMaxCount
    .all()
    .map((time) => toLocalUtcTime(time))
    .sort();

  return times;
};

export const updateTimeOcurrencesRule = ({ rrule, date }: { rrule: string; date: Date }) => {
  const now = DateTime.now();
  const rule = RRule.fromString(rrule);

  const startOfTheDay = now.startOf("day");
  const endOfTheDay = now.endOf("day");

  const startOfDayMinutes = startOfTheDay.hour * 60 + startOfTheDay.minute;
  const endOfDayMinutes = endOfTheDay.hour * 60 + endOfTheDay.minute;

  const localTime = DateTime.fromJSDate(date)
    .setZone(getTimeZone(), { keepLocalTime: true })
    .toJSDate();

  const newStartHour = localTime.getHours();
  const newStartMinute = localTime.getMinutes();

  const ruleHours = rule.options.byhour;
  const ruleMinute = rule.options.byminute[0];

  const totalOccurences = ruleHours.length ?? 1;

  const clampedStartMinutes = Math.min(
    Math.max(newStartHour * 60 + newStartMinute, startOfDayMinutes),
    endOfDayMinutes,
  );

  const existingMinutes = ruleHours.map((h, i) => h * 60 + (ruleMinute ?? 0)).sort((a, b) => a - b);

  const newByHour: number[] = [];
  let newByMinute: number;

  if (totalOccurences === 1) {
    newByHour.push(Math.floor(clampedStartMinutes / 60));
    newByMinute = clampedStartMinutes % 60;
  } else {
    const originalStart = existingMinutes[0];

    const offsets = existingMinutes.map((t) => t - originalStart);

    const maxOffset = offsets[offsets.length - 1];

    if (clampedStartMinutes + maxOffset > endOfDayMinutes) {
      return rrule;
    }

    for (const offset of offsets) {
      const doseMinutes = clampedStartMinutes + offset;
      newByHour.push(Math.floor(doseMinutes / 60));
    }
    newByMinute = clampedStartMinutes % 60;
  }

  const updatedRule = new RRule({
    freq: rule.options.freq,
    interval: rule.options.interval,
    byhour: newByHour,
    byminute: newByMinute,
    bysecond: 0,
  });

  return updatedRule.toString().replace("RRULE:", "");
};

export const buildRRule = (customPattern: CustomPattern) => {
  let options: Partial<Options>;

  if (customPattern.unit === "DAILY") {
    const byhours = populateOcurrencesTimes(
      customPattern.hoursBetweenOccurrences,
      customPattern.occurrencesPerDay,
    ).map((time) => time.getHours());

    options = {
      freq: RRule.DAILY,
      interval: customPattern.intervalValue,
      byhour: byhours,
    };
  } else {
    const byhours = populateOcurrencesTimes(
      customPattern.intervalValue,
      customPattern.occurrencesPerDay,
    ).map((time) => time.getHours());
    options = {
      freq: RRule.HOURLY,
      byhour: byhours,
    };
  }

  const rule = new RRule({
    ...options,
    byminute: 0,
    bysecond: 0,
  });

  return rule.toString().replace("RRULE:", "");
};

export const getRuleText = (rrule: string) => {
  const rule = RRule.fromString(rrule);

  return rule.toText();
};

const populateOcurrencesTimes = (
  hoursBetweenOccurrences: number,
  occurrencesPerDay: number = 1,
) => {
  const START_HOUR = 7;
  const END_HOUR = 24;

  const now = DateTime.now();

  const start = now.set({
    hour: START_HOUR,
    minute: 0,
    second: 0,
  });

  if (occurrencesPerDay === 1) {
    return [start.toJSDate()];
  }

  const endOfDay = now.set({ hour: END_HOUR, minute: 0, second: 0 });

  const times: DateTime[] = [];

  for (let i = 0; i <= occurrencesPerDay - 1; i++) {
    const next = start.plus({ hours: i * hoursBetweenOccurrences });
    if (next >= endOfDay) break;
    times.push(next);
  }
  return times.map((times) => times.toJSDate());
};

export const formatRRuleToRussian = (rrule: string | undefined) => {
  if (!rrule) return;
  const rule = RRule.fromString(rrule);
  const options = rule.options;
  const interval = options.interval || 1;

  switch (options.freq) {
    case RRule.HOURLY: {
      const hours = options.byhour || [];
      const equalInterval = calculateEqualHourInterval(hours);

      if (equalInterval) {
        return `Каждые ${equalInterval} ${pluralizeHours(equalInterval)}, ${hours.length} ${pluralizeTimes(hours.length)} в день`;
      }

      return "Каждый час";
    }

    case RRule.DAILY: {
      const hours = options.byhour || [];
      const minutes = options.byminute;

      let baseText = "";
      if (interval === 1) {
        baseText = "Каждый день";
      } else {
        baseText = `Каждые ${interval} ${pluralizeDays(interval)}`;
      }

      if (hours.length === 1) {
        const hour = String(hours[0]).padStart(2, "0");
        return `${baseText} в ${hour}:${minutes[0]}`;
      }

      const equalInterval = calculateEqualHourInterval(hours);

      if (equalInterval) {
        return `${baseText}, каждые ${equalInterval} ${pluralizeHours(equalInterval)}`;
      }

      return `${baseText}, ${hours.length} ${pluralizeTimes(hours.length)} в день`;
    }
  }
};

const calculateEqualHourInterval = (hours: number[]) => {
  if (hours.length < 2) {
    return null;
  }
  const sorted = [...hours].sort((a, b) => a - b);
  const diffs: number[] = [];

  for (let i = 1; i < sorted.length; i++) {
    diffs.push(sorted[i] - sorted[i - 1]);
  }
  const isEqual = diffs.every((d) => d === diffs[0]);

  return isEqual ? diffs[0] : null;
};

const pluralize = (count: number, one: string, few: string, many: string) => {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) {
    return one;
  }
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) {
    return few;
  }
  return many;
};

const pluralizeHours = (count: number) => pluralize(count, "час", "часа", "часов");
const pluralizeDays = (count: number) => pluralize(count, "день", "дня", "дней");
const pluralizeTimes = (count: number) => pluralize(count, "раз", "раза", "раз");
