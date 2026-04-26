import { CustomPattern, Unit } from "./types";

export const DEFAULT_PATTERN: CustomPattern = {
  unit: "HOURLY",
  intervalValue: 3,
  occurrencesPerDay: 3,
};

export const HEIGHT = {
  COLLAPSED: 60,
  EXPANDED: {
    BASE: 150, // Without extra option.
    EXTRA: 190, // With extra opiton when user pick "DAILY".
    PICKER: 375, // Full height if extra option isn't included.
    EXTRA_WITH_PICKER: 415, // Full height if extra option is included.
  },
};

export const getOptionsValueLabel = (
  value: number,
  options: { label: string; value: number }[],
) => {
  return options.find((option) => option.value === value)?.label;
};

export const getUnitValueLabel = (unit: Unit, value: number) => {
  const num = Number(value);

  if (unit === "DAILY") {
    if (num === 1) {
      return "день";
    } else if (num > 1 && num < 5) {
      return "дня";
    } else {
      return "дней";
    }
  }
  if (unit === "HOURLY") {
    if (num === 1) {
      return "час";
    } else if (num > 1 && num < 5) {
      return "часа";
    } else {
      return "часов";
    }
  }
};
