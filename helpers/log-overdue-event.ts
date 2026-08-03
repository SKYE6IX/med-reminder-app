import { api } from "@/utils/axiosInstance";
import { getDefaultISODate } from "@/utils/luxonUtil";

export const logOverdueEvents = async () => {
  const isoDate = getDefaultISODate();

  try {
    await api.put("medications/schedules/overdue", {
      eventDateUntil: isoDate,
    });
  } catch (error) {
    console.log("An error occur when try to log overdue events: ", error);
  }
};
