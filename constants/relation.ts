export type Relation =
  | "FATHER"
  | "MOTHER"
  | "SON"
  | "DAUGHTER"
  | "BROTHER"
  | "SISTER"
  | "WIFE"
  | "HUSBAND"
  | "SELF";

type RelationItem = { label: string; value: Relation };

export const RELATION_LIST: RelationItem[] = [
  { label: "Отец", value: "FATHER" },
  { label: "Мать", value: "MOTHER" },
  { label: "Сын", value: "SON" },
  { label: "Дочь", value: "DAUGHTER" },
  { label: "Брат", value: "BROTHER" },
  { label: "Сестра", value: "SISTER" },
  { label: "Жена", value: "WIFE" },
  { label: "Муж", value: "HUSBAND" },
];
