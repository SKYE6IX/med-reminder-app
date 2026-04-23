import { DosageMeasurement } from "@/types/medication";

export const DOSAGE_UNITS = [
  { label: "Таблетка", icon: "💊", value: DosageMeasurement.TABLET },
  { label: "Мл", icon: "🥤", value: DosageMeasurement.MILLIMETERS },
  { label: "Ложка", icon: "🥄", value: DosageMeasurement.SPOON },
  { label: "Впрыскивание", icon: "💨", value: DosageMeasurement.SPRAY },
  { label: "Капля", icon: "💧", value: DosageMeasurement.DROPS },
  { label: "Капсула", icon: "⚪", value: DosageMeasurement.CAPSULE },
];
