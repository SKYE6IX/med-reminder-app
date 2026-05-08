import { DOSAGE_UNITS } from "@/constants/schedule-options";

export const getDosageUnit = (value: string) => {
  if (value === "ml") {
    return "Мл";
  }
  const label = DOSAGE_UNITS.find((unit) => unit.value === value.toUpperCase())?.label;
  return label;
};
