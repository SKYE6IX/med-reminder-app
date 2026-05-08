import { DateTime } from "@/utils/luxonUtil";

export const getTakenAt = (isoDate: string | null) => {
  if (!isoDate) return;

  const takenAt = DateTime.fromISO(isoDate).setLocale("ru");

  return `Принято в ${takenAt.toLocaleString({ hour: "2-digit", minute: "2-digit", hourCycle: "h24" })}`;
};
