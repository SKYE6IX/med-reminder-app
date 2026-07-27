import AssayIcon from "@/component/icons/assay-icon";
import CapsuleIcon from "@/component/icons/capsule-icon";
import DropsIcon from "@/component/icons/drops-icon";
import Ellipsis from "@/component/icons/ellipsis";
import EyeDropIcon from "@/component/icons/eye-drop-icon";
import InjectionIcon from "@/component/icons/injection-icon";
import PillGramIcon from "@/component/icons/pill-gram-icon";
import PillCountIcon from "@/component/icons/pills-count";
import PillsMgIcon from "@/component/icons/pills-mg-icon";
import SprayBottleIcon from "@/component/icons/spray-bottle-icon";
import SprayIcon from "@/component/icons/spray-icon";
import SyrupBottleIcon from "@/component/icons/syrup-bottle-icon";
import TabletIcon from "@/component/icons/tablet-icon";
import { lng } from "@/i18next/i18next";
import { DosageMeasurement, MedicationUnit } from "@/types/medication";
const isRU = lng === "ru";

export const DOSAGE_MEASUREMENT = [
  { label: isRU ? "мг" : "mg", icon: PillsMgIcon, value: DosageMeasurement.MILLIGRAM },
  { label: isRU ? "г" : "g", icon: PillGramIcon, value: DosageMeasurement.GRAM },
  { label: isRU ? "мл" : "ml", icon: AssayIcon, value: DosageMeasurement.MILLIMETERS },
  { label: isRU ? "Впрыскивание" : "Spray", icon: SprayBottleIcon, value: DosageMeasurement.SPRAY },
  { label: isRU ? "Капля" : "Drop", icon: DropsIcon, value: DosageMeasurement.DROPS },
  { label: isRU ? "Шт" : "Pcs", icon: PillCountIcon, value: DosageMeasurement.CAPSULE },
];

export const MEDICATION_UNITS = [
  { name: isRU ? "Капсулы" : "Capsule", icon: CapsuleIcon, value: MedicationUnit.CAPSULE },
  { name: isRU ? "Таблетки" : "Tablet", icon: TabletIcon, value: MedicationUnit.TABLET },
  { name: isRU ? "Инъекции" : "Injection", icon: InjectionIcon, value: MedicationUnit.INJECTION },
  { name: isRU ? "Спрей" : "Spray", icon: SprayIcon, value: MedicationUnit.SPRAY },
  { name: isRU ? "Капли" : "Drop", icon: EyeDropIcon, value: MedicationUnit.DROPS },
  { name: isRU ? "Сироп" : "Syrup", icon: SyrupBottleIcon, value: MedicationUnit.SYRUP },
  { name: isRU ? "Другое" : "Other", icon: Ellipsis, value: MedicationUnit.OTHER },
];

export const OCCURENCES_PER_DAY = [
  { label: isRU ? "1 раз" : "1 time", value: 1 },
  { label: isRU ? "2 раза" : "2 times", value: 2 },
  { label: isRU ? "3 раза" : "3 times", value: 3 },
  { label: isRU ? "4 раза" : "4 times", value: 4 },
  { label: isRU ? "5 раз" : "5 times", value: 5 },
  { label: isRU ? "6 раз" : "6 times", value: 6 },
  { label: isRU ? "7 раз" : "7 times", value: 7 },
  { label: isRU ? "8 раз" : "8 times", value: 8 },
  { label: isRU ? "9 раз" : "9 times", value: 9 },
  { label: isRU ? "10 раз" : "10 times", value: 10 },
];

export const HOUR_BETWEEN_OCCURENCES = [
  { label: isRU ? "1 час" : "1 hour", value: 1 },
  { label: isRU ? "2 часа" : "2 hours", value: 2 },
  { label: isRU ? "3 часа" : "3 hours", value: 3 },
  { label: isRU ? "4 часа" : "4 hours", value: 4 },
  { label: isRU ? "5 часов" : "5 hours", value: 5 },
  { label: isRU ? "6 часов" : "6 hours", value: 6 },
  { label: isRU ? "7 часов" : "7 hours", value: 7 },
  { label: isRU ? "8 часов" : "8 hours", value: 8 },
  { label: isRU ? "9 часов" : "9 hours", value: 9 },
  { label: isRU ? "10 часов" : "10 hours", value: 10 },
];
