import { DateTime } from "@/utils/luxonUtil";

export const showEventActionButton = (scheduleAt: string, status: string, now: DateTime) => {
  if (!scheduleAt) {
    return false;
  }

  const scheduleTime = DateTime.fromISO(scheduleAt, {
    locale: "ru",
    setZone: true,
  });

  const isSameDay = now.hasSame(scheduleTime, "day");
  const isTimeReached = now >= scheduleTime;

  return isSameDay && isTimeReached && !["TAKEN", "MISSED"].includes(status);
};

// CASE FOR UPDATING EVENTS BUTTON.
// The button won't show for events that are yet to happened.✅
// The button should show for event that the current time is greater than or equal to ✅
// The button shouldn't shown for event that either has a status of TAKEN or MISSED ✅
