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
  TABLET = "TABLET",
  SPRAY = "SPRAY",
  DROPS = "DROPS",
  SPOON = "SPOON",
  MILLIMETERS = "MILLIMETERS",
}

export interface MedicationPackCreation {
  medicationProfileId: string;
  totalQuantity: string;
  reminderDays: number;
}

export interface Pack {
  totalAmountInPack: string;
  currentAmountInPack: string;
  reminderDays: number;
}

export interface ScheduleCreation {
  dosage: string;
  recurrenceRule: string;
  startDate: string;
  timeZone: string;
}
export interface ScheduleResponse {
  id: string;
  dosage: string;
  measurement: DosageMeasurement;
  recurrenceRule: string;
  starTime: string;
  startDate: string;
  amountTaken: string;
}
export interface CreateMedication {
  profileId: string;
  medicationName: string;
  medicationUnit: MedicationUnit;
  medicationMeasurement: DosageMeasurement;
  medicationNote: string | null;
  schedule: ScheduleCreation;
  medicationPack: Omit<MedicationPackCreation, "medicationProfileId"> | null;
}

export interface MedicationProfile {
  id: string;
  medicationName: string;
  medicationUnit: MedicationUnit;
  medicationImageUrl: string;
  status: string;
  note: string | null;
  profile: ProfileResponse;
  schedule: ScheduleResponse;
  pack: Pack | null;
}

export interface MedicationScheduleEvent {
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

export interface RefillMedicationPack {
  id: string;
  status: string;
  startedAt: string;
  totalQuantity: string;
  medicationName: string;
  medicationImageUrl: string;
  medicationProfileId: string;
}
