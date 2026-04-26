import { FrequencySettingsState } from "../frequency-settings";

export type Unit = "HOURLY" | "DAILY";

export type CustomPattern =
  | {
      unit: "HOURLY";
      intervalValue: number;
      occurrencesPerDay: number;
    }
  | {
      unit: "DAILY";
      intervalValue: number;
      occurrencesPerDay: number;
      hoursBetweenOccurrences: number;
    };

export type CustomFrequencyProps = {
  isSelected: boolean;
  defaultvalue: FrequencySettingsState;
  handleSelection: (freq: FrequencySettingsState) => void;
  onCustomPatternChange: (pattern: Partial<CustomPattern>) => void;
};

export interface CustomState {
  showPicker:
    | "intervalUnit"
    | "intervalValue"
    | "occurrencesPerDay"
    | "hoursBetweenOccurrences"
    | undefined;
  pattern: CustomPattern;
}
