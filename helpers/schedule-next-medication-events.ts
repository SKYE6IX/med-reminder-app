import { api } from "@/utils/axiosInstance";
import { getNowISODate, getTimeZone } from "@/utils/luxonUtil";

export const scheduleNextMedicationEvents = async () => {
  const now = getNowISODate();
  try {
    await api.post("medications/schedules/event/next", {
      invocationAt: now,
      timeZone: getTimeZone(),
    });
  } catch (error) {
    console.log("An error occur! Unable to schedule next medication events ", error);
  }
};
