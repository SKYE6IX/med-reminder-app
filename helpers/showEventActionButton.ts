import { MedicationScheduleResponse } from "@/types/medication";
import { DateTime, getTimeZone } from "@/utils/luxonUtil";

export const showEventActionButton = (event: MedicationScheduleResponse) => {
  if (!event) {
    return false;
  }

  const now = DateTime.now().setZone(getTimeZone());

  const scheduleTime = DateTime.fromISO(event.scheduleAt, {
    locale: "ru",
    setZone: true,
  });

  const isSameDay = now.hasSame(scheduleTime, "day");
  const isTimeReached = now >= scheduleTime;

  return isSameDay && isTimeReached && !["TAKEN", "MISSED"].includes(event.status);
};

// CASE FOR UPDATING EVENTS BUTTON.
// The button won't show for events that are yet to happened.✅
// The button should show for event that the current time is greater than or equal to ✅
// The button shouldn't shown for event that either has a status of TAKEN or MISSED ✅
