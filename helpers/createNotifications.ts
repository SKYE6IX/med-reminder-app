import { MedicationScheduleEvent } from "@/types/medication";
import { NotificationSettings } from "@/types/notification";
import { api, axios } from "@/utils/axiosInstance";
import { getDateLocalString } from "@/utils/luxonUtil";
import { NotificationHelper } from "./notification-helper";

export const createNotification = async (settings: Partial<NotificationSettings>) => {
  const localDateString = getDateLocalString();

  try {
    const response = await api.get<MedicationScheduleEvent[]>("medications/schedules/event", {
      params: {
        eventDate: localDateString,
      },
    });

    if (response.data.length >= 1) {
      const events = response.data;
      const notifications = new NotificationHelper(settings);

      await Promise.all(
        events.map((event) =>
          notifications.scheduleDosageNotification({
            scheduleId: event.id,
            medicationName: event.medicationName,
            scheduleAt: event.scheduleAt,
            medicationProfileId: event.medicationProfileId,
          }),
        ),
      );
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("An axios error occur when create a medication -> ", error);
    } else {
      console.log("Unknow error occur when create a medication -> ", error);
    }
  }
};
