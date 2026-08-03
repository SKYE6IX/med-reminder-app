import { ProfileResponse } from "./user";

export enum MedicationUnit {
  CAPSULE = "CAPSULE",
  TABLET = "TABLET",
  SPRAY = "SPRAY",
  DROPS = "DROPS",
  SYRUP = "SYRUP",
  INJECTION = "INJECTION",
  OTHER = "OTHER",
}

export enum DosageMeasurement {
  CAPSULE = "CAPSULE",
  SPRAY = "SPRAY",
  DROPS = "DROPS",
  MILLIMETERS = "MILLIMETERS",
  MILLIGRAM = "MILLIGRAM",
  GRAM = "GRAM",
}

export interface CreateMedicationProfile {
  profileId: string;
  medicationName: string;
  medicationUnit: MedicationUnit;
  medicationMeasurement: DosageMeasurement;
  medicationNote: string | null;
  medicationReason: string | null;
  timeZone: string;
  schedule: CreateSchedule;
  medicationPack: Omit<MedicationPackCreation, "medicationProfileId"> | null;
}
export interface MedicationPackCreation {
  medicationProfileId: string;
  totalQuantity: string;
  reminderDays: number;
  timeZone: string;
}
export interface CreateSchedule {
  dosage: string;
  recurrenceRule: string;
  startDate: string;
  endDate: string | null;
}
export interface ScheduleResponse {
  id: string;
  dosage: string;
  measurement: DosageMeasurement;
  recurrenceRule: string;
  starTime: string;
  startDate: string;
  endDate: string | null;
  amountTaken: string;
}
export interface MedicationProfileReponse {
  id: string;
  medicationName: string;
  medicationUnit: MedicationUnit;
  medicationImageUrl: string;
  status: string;
  note: string | null;
  medicationReason: string | null;
  profile: ProfileResponse;
  schedule: ScheduleResponse;
  pack: {
    totalAmountInPack: string;
    currentAmountInPack: string;
  } | null;
}

export interface ScheduleEventResponse {
  id: string;
  status: string;
  medicationName: string;
  medicationImageUrl: string;
  medicationProfileId: string;
  dosage: string;
  measurement: DosageMeasurement;
  scheduleAt: string;
  takenAt: string | null;
  profile: ProfileResponse;
}
export interface MedicationPackResponse {
  id: string;
  status: string;
  startedAt: string | null;
  endedAt: string | null;
  totalQuantity: string;
  currentQuantity: string;
  isRefilled: boolean;
  reminderDays: number;
  medicationProfileId: string;
  medicationName: string;
  medicationImageUrl: string;
  dosageAmount: string;
  dosageMeasurement: string;
}
