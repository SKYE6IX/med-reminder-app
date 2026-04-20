import { MedicationMeasurement, MedicationUnit } from "@/types/medication";
import { create } from "zustand";

interface Schedule {
  dosage: number;
  recurrenceRule: string;
  startDate: string;
  timeZone: string;
}

interface MedicationPack {
  totalQuantity: number;
  notifyRule: string;
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
    medicationMeasurement: MedicationMeasurement;
    medicationNote: string | null;
    schedule: Schedule | null;
    medicationPack: MedicationPack | null;
  };

  setMedicationDetails: (
    data: Partial<
      Omit<AddPillStore["formState"], "schedule" | "medicationPack">
    >,
  ) => void;

  setMedicatioSchedule: (schedule: Schedule) => void;

  setMedicationpack: (packData: MedicationPack) => void;

  isFieldFilled: (fields: FieldName[]) => boolean;
}

export const useAddPillStore = create<AddPillStore>()((set, get) => ({
  formState: {
    profileId: "",
    medicationName: "",
    medicationUnit: MedicationUnit.CAPSULE,
    medicationMeasurement: MedicationMeasurement.TABLET,
    medicationNote: null,
    schedule: null,
    medicationPack: null,
  },

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
        schedule: schedule,
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
}));
