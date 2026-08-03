import { toLocalTime } from "@/utils/luxonUtil";

export const getScheduleTime = (scheduleTime: string, lng: string) => {
  const date = new Date(scheduleTime);
  return toLocalTime(date, lng);
};
