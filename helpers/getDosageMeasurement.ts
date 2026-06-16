import { DOSAGE_MEASUREMENT } from "@/constants/medication-constants";

export const getDosageMeasurement = (value: string) => {
  const label = DOSAGE_MEASUREMENT.find((unit) => unit.value === value)?.label;
  return label;
};
