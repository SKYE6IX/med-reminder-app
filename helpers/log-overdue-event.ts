import { api } from "@/utils/axiosInstance";
import { getNowISODate } from "@/utils/luxonUtil";

export const logOverdueEvents = async () => {
  const now = getNowISODate();
  try {
    await api.put("medications/schedules/event/overdue", {
      eventDateUntil: now,
    });
  } catch (error) {
    console.log("An error occur when try to log overdue events: ", error);
  }
};
