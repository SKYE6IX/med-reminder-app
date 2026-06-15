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
import { DosageMeasurement, MedicationUnit } from "@/types/medication";

export const DOSAGE_MEASUREMENT = [
  { label: "мг", icon: PillsMgIcon, value: DosageMeasurement.MILLIGRAM },
  { label: "г", icon: PillGramIcon, value: DosageMeasurement.GRAM },
  { label: "мл", icon: AssayIcon, value: DosageMeasurement.MILLIMETERS },
  { label: "Впрыскивание", icon: SprayBottleIcon, value: DosageMeasurement.SPRAY },
  { label: "Капля", icon: DropsIcon, value: DosageMeasurement.DROPS },
  { label: "Шт", icon: PillCountIcon, value: DosageMeasurement.CAPSULE },
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
