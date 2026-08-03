import { DosageMeasurement, MedicationUnit } from "@/types/medication";
import { getDefaultISODate } from "@/utils/luxonUtil";
import { create } from "zustand";

export type SchedulePreset = "ONCE_A_DAY" | "TWICE_A_DAY" | "THREE_TIMES_A_DAY" | "CUSTOM";

interface ScheduleState {
  dosage: string;
  rule: {
    recurrenceRule: string;
    preset: SchedulePreset | undefined;
  };
  startDate: string;
  endDate: string | null;
}

interface MedicationPackState {
  totalQuantity: string;
  reminderDays: number;
}

type FieldName = keyof AddPillStore["formState"];

const NULLABLE_FIELDS: Partial<Record<FieldName, true>> = {
  medicationPack: true,
  medicationNote: true,
};

interface AddPillStore {
  formState: {
    profileId: string;
    medicationName: string;
    medicationUnit: MedicationUnit;
    medicationMeasurement: DosageMeasurement;
    medicationNote: string | null;
    medicationReason: string | null;
    schedule: ScheduleState;
    medicationPack: MedicationPackState | null;
  };

  setMedicationDetails: (
    data: Partial<Omit<AddPillStore["formState"], "schedule" | "medicationPack">>,
  ) => void;

  setMedicatioSchedule: (schedule: Partial<ScheduleState>) => void;

  setMedicationpack: (packData: MedicationPackState | null) => void;

  isFieldFilled: (fields: FieldName[]) => boolean;

  clearFormState: () => void;
}

const DEFAULT_STATE: AddPillStore["formState"] = {
  profileId: "",
  medicationName: "",
  medicationUnit: MedicationUnit.CAPSULE,
  medicationMeasurement: DosageMeasurement.MILLIGRAM,
  medicationNote: null,
  medicationReason: null,
  schedule: {
    dosage: "10",
    rule: {
      recurrenceRule: "FREQ=DAILY;BYHOUR=8;BYMINUTE=0",
      preset: "ONCE_A_DAY",
    },
    startDate: getDefaultISODate(),
    endDate: null,
  },
  medicationPack: null,
};

export const useAddPillStore = create<AddPillStore>()((set, get) => ({
  formState: DEFAULT_STATE,

  setMedicationDetails(data) {
    set((state) => ({
      ...state,
      formState: {
        ...state.formState,
        ...data,
      },
    }));
  },

  setMedicatioSchedule(schedule) {
    set((state) => ({
      ...state,
      formState: {
        ...state.formState,
        schedule: {
          ...state.formState.schedule,
          ...schedule,
        },
      },
    }));
  },

  setMedicationpack(packData) {
    set((state) => ({
      ...state,
      formState: {
        ...state.formState,
        medicationPack: packData,
      },
    }));
  },

  isFieldFilled(fields) {
    const { formState } = get();
    return fields.every((field) => {
      const value = formState[field];
      if (NULLABLE_FIELDS[field]) return true;
      if (value === null || value === undefined) return false;
      if (typeof value === "string") return value.trim().length > 0;
      return true;
    });
  },

  clearFormState() {
    set((state) => ({ ...state, formState: DEFAULT_STATE }));
  },
}));
