import { useNotificationDataStore } from "@/stores/notification-data-store";
import { MedicationScheduleEvent } from "@/types/medication";
import { queryClient } from "@/utils/query-client";
import { useCallback, useEffect } from "react";
import { AppState } from "react-native";

export function useNotificationData({ selectedDate }: { selectedDate: string }) {
  const updateData = useCallback(async () => {
    await useNotificationDataStore.persist.rehydrate();

    if (useNotificationDataStore.getState().scheduleData === null) {
      return;
    }

    queryClient.setQueryData(
      ["schedule-events", selectedDate],
      (existingData: MedicationScheduleEvent[]) => {
        const updatedData = existingData?.map((scheduleEvent) =>
          scheduleEvent.id === useNotificationDataStore.getState().scheduleId
            ? useNotificationDataStore.getState().scheduleData
            : scheduleEvent,
        );
        useNotificationDataStore.getState().clearScheduleData();
        return updatedData;
      },
    );

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["medication-profile"] }),
      queryClient.invalidateQueries({ queryKey: ["medication-refill-packs"] }),
    ]);
  }, [selectedDate]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        updateData();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [updateData]);
}
