import { lng } from "@/i18next/i18next";

export type Relation =
  "FATHER" | "MOTHER" | "SON" | "DAUGHTER" | "BROTHER" | "SISTER" | "WIFE" | "HUSBAND" | "SELF";

type RelationItem = { label: string; value: Relation };

const isRU = lng === "ru";
export const RELATION_LIST: RelationItem[] = [
  { label: isRU ? "Отец" : "Father", value: "FATHER" },
  { label: isRU ? "Мать" : "Mother", value: "MOTHER" },
  { label: isRU ? "Сын" : "Son", value: "SON" },
  { label: isRU ? "Дочь" : "Daughter", value: "DAUGHTER" },
  { label: isRU ? "Брат" : "Brother", value: "BROTHER" },
  { label: isRU ? "Сестра" : "Sister", value: "SISTER" },
  { label: isRU ? "Жена" : "Wife", value: "WIFE" },
  { label: isRU ? "Муж" : "Husband", value: "HUSBAND" },
];
