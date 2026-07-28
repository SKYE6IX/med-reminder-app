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
  { labelKey: "miligram", icon: PillsMgIcon, value: DosageMeasurement.MILLIGRAM },
  { labelKey: "gram", icon: PillGramIcon, value: DosageMeasurement.GRAM },
  { labelKey: "milimeter", icon: AssayIcon, value: DosageMeasurement.MILLIMETERS },
  { labelKey: "spray", icon: SprayBottleIcon, value: DosageMeasurement.SPRAY },
  { labelKey: "drops", icon: DropsIcon, value: DosageMeasurement.DROPS },
  { labelKey: "pcs", icon: PillCountIcon, value: DosageMeasurement.CAPSULE },
];

export const MEDICATION_UNITS = [
  { labelKey: "capsule", icon: CapsuleIcon, value: MedicationUnit.CAPSULE },
  { labelKey: "tablet", icon: TabletIcon, value: MedicationUnit.TABLET },
  { labelKey: "injection", icon: InjectionIcon, value: MedicationUnit.INJECTION },
  { labelKey: "spray", icon: SprayIcon, value: MedicationUnit.SPRAY },
  { labelKey: "drops", icon: EyeDropIcon, value: MedicationUnit.DROPS },
  { labelKey: "syrup", icon: SyrupBottleIcon, value: MedicationUnit.SYRUP },
  { labelKey: "other", icon: Ellipsis, value: MedicationUnit.OTHER },
];

export const OCCURENCES_PER_DAY = [
  { labelKey: "time_1", value: 1 },
  { labelKey: "time_2", value: 2 },
  { labelKey: "time_3", value: 3 },
  { labelKey: "time_4", value: 4 },
  { labelKey: "time_5", value: 5 },
  { labelKey: "time_6", value: 6 },
  { labelKey: "time_7", value: 7 },
  { labelKey: "time_8", value: 8 },
  { labelKey: "time_9", value: 9 },
  { labelKey: "time_10", value: 10 },
];

export const HOUR_BETWEEN_OCCURENCES = [
  { labelKey: "hour_1", value: 1 },
  { labelKey: "hour_2", value: 2 },
  { labelKey: "hour_3", value: 3 },
  { labelKey: "hour_4", value: 4 },
  { labelKey: "hour_5", value: 5 },
  { labelKey: "hour_6", value: 6 },
  { labelKey: "hour_7", value: 7 },
  { labelKey: "hour_8", value: 8 },
  { labelKey: "hour_9", value: 9 },
  { labelKey: "hour_10", value: 10 },
];
