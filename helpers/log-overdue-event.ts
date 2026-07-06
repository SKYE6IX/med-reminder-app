import { api } from "@/utils/axiosInstance";
import { getDateLocalString } from "@/utils/luxonUtil";

export const logOverdueEvents = async () => {
  const localDateString = getDateLocalString();
  try {
    await api.put("medications/schedules/overdue", {
      eventDateUntil: localDateString,
    });
  } catch (error) {
    console.log("An error occur when try to log overdue events: ", error);
  }
};
