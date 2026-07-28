import { DOSAGE_MEASUREMENT } from "@/constants/medication-constants";

export const getDosageMeasurementLabelKey = (value: string) => {
  const key = DOSAGE_MEASUREMENT.find((unit) => unit.value === value)?.labelKey;
  return key;
};
