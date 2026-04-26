import { CustomPattern } from "@/component/ui/custom-frequency/types";
import { Options, RRule } from "rrule";
import { DateTime, getTimeZone } from "./luxonUtil";

export const generateTimeOccurrences = ({ rrule }: { rrule: string }) => {
  const rule = RRule.fromString(rrule);
  const byhour = rule.options.byhour;
  const byminute = rule.options.byminute;
  const times = byhour
    .map((hour, i) => {
      const minute = byminute[i] ?? 0;
      const date = DateTime.now().set({ hour, minute, second: 0 });
      return date.toJSDate().toLocaleTimeString("ru-RU", {
        formatMatcher: "best fit",
        timeStyle: "short",
      });
    })
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
  const ruleMinutes = rule.options.byminute;

  const totalOccurences = ruleHours.length ?? 1;

  const clampedStartMinutes = Math.min(
    Math.max(newStartHour * 60 + newStartMinute, startOfDayMinutes),
    endOfDayMinutes,
  );

  const existingMinutes = ruleHours
    .map((h, i) => h * 60 + (ruleMinutes[i] ?? 0))
    .sort((a, b) => a - b);

  const newByHour: number[] = [];
  const newByMinute: number[] = [];

  if (totalOccurences === 1) {
    newByHour.push(Math.floor(clampedStartMinutes / 60));
    newByMinute.push(clampedStartMinutes % 60);
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
      newByMinute.push(doseMinutes % 60);
    }
  }

  const updatedRule = new RRule({
    freq: rule.options.freq,
    byhour: newByHour,
    byminute: newByMinute,
    bysecond: [0],
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
      interval: customPattern.intervalValue,
      byhour: byhours,
    };
  } else {
    const byhours = populateOcurrencesTimes(
      customPattern.intervalValue,
      customPattern.occurrencesPerDay,
    ).map((time) => time.getHours());

    options = {
      byhour: byhours,
    };
  }

  const rule = new RRule({
    ...options,
    freq: RRule.DAILY,
    byminute: [0],
    bysecond: [0],
  });

  return rule.toString().replace("RRULE:", "");
};

// DAILY
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
