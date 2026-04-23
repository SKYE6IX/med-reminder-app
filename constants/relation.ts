type RelationItem = { label: string; value: string };

export const RELATION_LIST = [
  { label: "Отец", value: "FATHER" },
  { label: "Мать", value: "MOTHER" },
  { label: "Сын", value: "SON" },
  { label: "Дочь", value: "DAUGHTER" },
  { label: "Брат", value: "BROTHER" },
  { label: "Сестра", value: "SISTER" },
  { label: "Жена", value: "WIFE" },
  { label: "Муж", value: "HUSBAND" },
] as const satisfies RelationItem[];

export type Relation = (typeof RELATION_LIST)[number]["value"];
