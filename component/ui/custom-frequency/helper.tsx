import { Platform } from "react-native";
import { CustomPattern, Unit } from "./types";

const isAndroid = Platform.OS === "android";
export const DEFAULT_PATTERN: CustomPattern = {
  unit: "HOURLY",
  intervalValue: 3,
  occurrencesPerDay: 3,
};

export const HEIGHT = {
  COLLAPSED: 60,
  EXPANDED: {
    BASE: isAndroid ? 170 : 165, // Without extra option.
    EXTRA: isAndroid ? 220 : 210, // With extra opiton when user pick "DAILY".
    PICKER_IOS: 390, // Full height if extra option isn't included. (IOS ONLY)
    EXTRA_WITH_PICKER_IOS: 430, // Full height if extra option is included. (IOS ONLY)
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
