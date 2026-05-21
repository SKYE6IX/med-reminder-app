import { toLocalTime } from "@/utils/luxonUtil";

export const getScheduleTime = (scheduleTime: string) => {
  const date = new Date(scheduleTime);
  return toLocalTime(date);
};
