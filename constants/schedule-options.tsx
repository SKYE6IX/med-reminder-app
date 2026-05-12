import CapsuleIcon from "@/component/icons/capsule-icon";
import Ellipsis from "@/component/icons/ellipsis";
import EyeDropIcon from "@/component/icons/eye-drop-icon";
import InjectionIcon from "@/component/icons/injection-icon";
import SprayIcon from "@/component/icons/spray-icon";
import SyrupBottleIcon from "@/component/icons/syrup-bottle-icon";
import TabletIcon from "@/component/icons/tablet-icon";
import { DosageMeasurement, MedicationUnit } from "@/types/medication";

export const DOSAGE_UNITS = [
  { label: "Таблетка", icon: "💊", value: DosageMeasurement.TABLET },
  { label: "Мл", icon: "🥤", value: DosageMeasurement.MILLIMETERS },
  { label: "Ложка", icon: "🥄", value: DosageMeasurement.SPOON },
  { label: "Впрыскивание", icon: "💨", value: DosageMeasurement.SPRAY },
  { label: "Капля", icon: "💧", value: DosageMeasurement.DROPS },
  { label: "Капсула", icon: "⚪", value: DosageMeasurement.CAPSULE },
];

export const MEDICATION_UNITS = [
  { name: "Капсулы", icon: CapsuleIcon, value: MedicationUnit.CAPSULE },
  { name: "Таблетки", icon: TabletIcon, value: MedicationUnit.TABLET },
  { name: "Инъекции", icon: InjectionIcon, value: MedicationUnit.INJECTION },
  { name: "Спрей", icon: SprayIcon, value: MedicationUnit.SPRAY },
  { name: "Капли", icon: EyeDropIcon, value: MedicationUnit.DROPS },
  { name: "Сироп", icon: SyrupBottleIcon, value: MedicationUnit.SYRUP },
  { name: "Другое", icon: Ellipsis, value: MedicationUnit.OTHER },
];

export const OCCURENCES_PER_DAY = [
  { label: "1 раз", value: 1 },
  { label: "2 раза", value: 2 },
  { label: "3 раза", value: 3 },
  { label: "4 раза", value: 4 },
  { label: "5 раз", value: 5 },
  { label: "6 раз", value: 6 },
  { label: "7 раз", value: 7 },
  { label: "8 раз", value: 8 },
  { label: "9 раз", value: 9 },
  { label: "10 раз", value: 10 },
];

export const HOUR_BETWEEN_OCCURENCES = [
  { label: "1 час", value: 1 },
  { label: "2 часа", value: 2 },
  { label: "3 часа", value: 3 },
  { label: "4 часа", value: 4 },
  { label: "5 часов", value: 5 },
  { label: "6 часов", value: 6 },
  { label: "7 часов", value: 7 },
  { label: "8 часов", value: 8 },
  { label: "9 часов", value: 9 },
  { label: "10 часов", value: 10 },
];
