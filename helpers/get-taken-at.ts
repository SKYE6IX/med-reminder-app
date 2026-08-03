import { DateTime } from "@/utils/luxonUtil";

export const getTakenAt = (isoDate: string | null, lng: string) => {
  if (!isoDate) return;
  const takenAt = DateTime.fromISO(isoDate).setLocale(lng);
  const text = lng === "ru" ? "Принято в " : "Taken at ";

  return `${text}${takenAt.toLocaleString({ hour: "2-digit", minute: "2-digit" })}`;
};
