import { Frequency } from "../frequency-settings";

export type Unit = "HOURLY" | "DAILY";

export type CustomFrequencyProps = {
  isSelected: boolean;
  handleSelection: (freq: Frequency) => void;
  onCustomValueSet: ({ count, unit }: { count: number; unit: Unit }) => void;
};

export interface CustomState {
  showPicker: "count" | "unit" | "repeat" | "interval" | undefined;
  frequencyCount: number;
  frequencyUnit: Unit;
  repeatOption: number;
  hourIntervalOpiton: number;
}

export interface TCustomFrequency extends Frequency {}
