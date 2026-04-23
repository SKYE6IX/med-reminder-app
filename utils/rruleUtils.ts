import { Options, RRule } from "rrule";
import { DateTime, getTimeZone } from "./luxonUtil";

const DAY_START_HOUR = 7;
const DAY_END_HOUR = 21;

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

export const updateTimeRules = ({
  rrules,
  date,
}: {
  rrules: string;
  date: Date;
}) => {
  const rule = RRule.fromString(rrules);

  const localTime = DateTime.fromJSDate(date)
    .setZone(getTimeZone(), { keepLocalTime: true })
    .toJSDate();

  const hours = rule.options.byhour;
  const minutes = rule.options.byminute;
  const count = hours.length;

  const startHour = localTime.getHours();
  const startMinute = localTime.getMinutes();

  const clampedStartMinutes = Math.min(
    Math.max(startHour * 60 + startMinute, DAY_START_HOUR * 60),
    DAY_END_HOUR * 60,
  );

  const existingMinutes = hours
    .map((h, i) => h * 60 + (minutes[i] ?? 0))
    .sort((a, b) => a - b);

  const newByHour: number[] = [];
  const newByMinute: number[] = [];

  if (count === 1) {
    newByHour.push(Math.floor(clampedStartMinutes / 60));
    newByMinute.push(clampedStartMinutes % 60);
  } else {
    const originalStart = existingMinutes[0];
    const offsets = existingMinutes.map((t) => t - originalStart);

    for (const offset of offsets) {
      const doseMinutes = Math.min(
        clampedStartMinutes + offset,
        DAY_END_HOUR * 60,
      );
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

export const buildRRules = ({
  repeatCount,
  repeatUnit,
}: {
  repeatCount: number;
  repeatUnit: "DAILY" | "HOURLY";
}) => {
  let options: Partial<Options>;

  if (repeatUnit === "DAILY") {
    options = {
      interval: repeatCount,
      byhour: populateTimes().map((time) => time.getHours()),
    };
  } else {
    options = {
      byhour: populateTimes(repeatCount).map((time) => time.getHours()),
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

const populateTimes = (repeatCount: number = 1) => {
  const START_HOUR = 9;
  const END_HOUR = 21;
  const totalHours = END_HOUR - START_HOUR;

  const start = DateTime.now().set({
    hour: START_HOUR,
    minute: 0,
    second: 0,
    millisecond: 0,
  });

  const times: DateTime[] = [];

  const steps = Math.floor(totalHours / repeatCount);

  if (repeatCount === 1) {
    return [start.toJSDate()];
  }

  for (let i = 0; i <= steps; i++) {
    times.push(start.plus({ hours: i * repeatCount }));
  }

  return times.map((times) => times.toJSDate());
};
