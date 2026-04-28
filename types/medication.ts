import { Relation } from "@/constants/relation";

export enum MedicationUnit {
  CAPSULE = "CAPSULE",
  TABLET = "TABLET",
  SPRAY = "SPRAY",
  DROPS = "DROPS",
  SYRUP = "SYRUP",
  INJECTION = " INJECTION",
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
interface MedicationPack {
  totalQuantity: number;
  notifyRule: string;
}

interface ScheduleCreation {
  dosage: number;
  recurrenceRule: string;
  startDate: string;
  timeZone: string;
}
export interface ScheduleResponse {
  id: string;
  dosage: number;
  measurement: DosageMeasurement;
  recurrenceRule: string;
  starTime: string;
  startDate: string;
}
export interface CreateMedication {
  profileId: string;
  medicationName: string;
  medicationUnit: MedicationUnit;
  medicationMeasurement: DosageMeasurement;
  medicationNote: string | null;
  schedule: ScheduleCreation;
  medicationPack: MedicationPack | null;
}

export interface ProfileResponse {
  id: string;
  name: string;
  relation: Relation;
  isSelf: boolean;
}
export interface MedicationProfileResponse {
  id: string;
  medicationName: string;
  medicationUnit: MedicationUnit;
  medicationImageUrl: string;
  status: string;
  note: string | null;
  createdAt: string;
  profile: ProfileResponse;
  schedule: ScheduleResponse;
}

export interface MedicationScheduleResponse {
  id: string;
  status: string;
  medicationName: string;
  medicationImageUrl: string;
  dosage: number;
  measurement: DosageMeasurement;
  scheduleAt: string;
  profile: {
    id: string;
    name: string;
    relation: Relation;
    isSelf: boolean;
  };
  takenAt: string | null;
}
