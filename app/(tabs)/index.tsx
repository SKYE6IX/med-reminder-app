import PlusIcon from "@/component/icons/plus-icon";
import CustomButton from "@/component/ui/custom-button/custom-button";
import Loader from "@/component/ui/loader";
import Tabs from "@/component/ui/tabs";
import WeekView from "@/component/ui/week-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useUserData } from "@/hooks/use-user-data";
import { MedicationScheduleResponse } from "@/types/medication";
import { getDateLocalString, getUpcomingTime, toLocalTime } from "@/utils/luxonUtil";
import { Image } from "expo-image";
import { useCallback, useMemo, useRef, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import MedicationCard from "@/component/ui/medication-card/medication-card";
import { getDosageUnit } from "@/helpers/getDosageUnit";
import { getScheduleBadge } from "@/helpers/getScheduleBadge";
import { getTakenAt } from "@/helpers/getTakenAt";
import { showEventActionButton } from "@/helpers/showEventActionButton";
import { useFeedBackStore } from "@/stores/feedback-store";
import { ProfileResponse } from "@/types/user";
import { api, axios } from "@/utils/axiosInstance";
import { queryClient } from "@/utils/query-client";
import { useFocusEffect } from "@react-navigation/native";
import { useMutation, useQuery } from "@tanstack/react-query";

type TABS_VALUE = "ALL" | "TAKEN" | "MISSED";

interface UpdateScheduleEvent {
  id: string;
  action: "TAKEN" | "MISSED";
}

const TABS = [
  { label: "Все", value: "ALL" },
  { label: "Принято", value: "TAKEN" },
  { label: "Пропущено", value: "MISSED" },
];

const localDateString = getDateLocalString();

const getScheduleTime = (scheduleTime: string) => {
  const date = new Date(scheduleTime);
  return toLocalTime(date);
};

// Fetch schedule events query
const fetchScheduleEvents = async (params: string) => {
  const response = await api.get<MedicationScheduleResponse[]>("medications/schedules/event", {
    params: {
      eventDate: params,
    },
  });
  return response.data;
};

// Update schedule events
const updateScheduleEventMutaion = async (data: UpdateScheduleEvent) => {
  const response = await api.put<MedicationScheduleResponse>(
    `medications/schedules/event/${data.id}`,
    { action: data.action },
  );
  return response.data;
};

export default function Home() {
  const { user } = useUserData();

  const initialFocus = useRef(true);

  const [activeTab, setActiveTab] = useState<TABS_VALUE>("ALL");
  const [selectedDate, setSelectedDate] = useState(localDateString);
  const [onFocusTrigger, setOnFocusTrigger] = useState(0);

  const insets = useSafeAreaInsets();
  const { showFeedBack } = useFeedBackStore();

  // Query schedule event list
  const { data, isLoading } = useQuery({
    queryKey: ["schedule-events", selectedDate],
    queryFn: () => fetchScheduleEvents(selectedDate),
    staleTime: 60 * 60 * 10000,
  });

  // Update schedule event
  const { isPending, mutate } = useMutation({
    mutationFn: updateScheduleEventMutaion,
    onSuccess(data, variables) {
      queryClient.setQueryData(
        ["schedule-events", selectedDate],
        (existingData: MedicationScheduleResponse[]) =>
          existingData.map((scheduleEvent) =>
            scheduleEvent.id === variables.id ? data : scheduleEvent,
          ),
      );
    },
    onError(error, variables, onMutateResult, context) {
      if (axios.isAxiosError(error)) {
        console.log("An axios error occur when updating schedule event -> ", error);
      } else {
        console.log("An Unknown error occur when updating schedule event -> ", error);
      }
      showFeedBack({
        title: "Ошибка!",
        message: "Что-то пошло не так. Пожалуйста, попробуйте снова.",
        status: "error",
      });
    },
  });

  const hasScheduleEvents = data && data.length >= 1 ? true : false;

  // When screen is back on focus after initial
  // we trigger a re-render for Flatlist to keep events card up to date
  useFocusEffect(
    useCallback(() => {
      if (initialFocus.current) {
        initialFocus.current = false;
        return;
      }
      setOnFocusTrigger((prv) => prv + 1);
    }, []),
  );

  // Themes
  const color = useThemeColor({}, "textPrimary");
  const mutedColor = useThemeColor({}, "textMuted");
  const bgPrimary = useThemeColor({}, "backgroundPrimary");

  const filterScheduleEvents = useMemo(() => {
    if (activeTab === "ALL") {
      return data?.sort((a, b) => {
        const aIsDone = a.status === "TAKEN" || a.status === "MISSED";
        const bIsDone = b.status === "TAKEN" || b.status === "MISSED";
        if (aIsDone && !bIsDone) return 1;
        if (!aIsDone && bIsDone) return -1;

        const sortA = new Date(a.scheduleAt).getHours();
        const sortB = new Date(b.scheduleAt).getHours();
        return sortA - sortB;
      });
    } else {
      return data?.filter((med) => med.status === activeTab);
    }
  }, [activeTab, data]);

  const handleOnTabChange = (tab: TABS_VALUE) => {
    setActiveTab(tab);
  };

  const handleOnDateChange = (ISODate: string) => {
    const date = new Date(ISODate);
    const toLocalDateString = getDateLocalString(date);
    setSelectedDate(toLocalDateString);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgPrimary }]} edges={["top"]}>
      <Loader visible={isLoading || isPending} />
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerProfileContainer}>
            <Image
              source={require("@/assets/mock-profile.jpg")}
              style={styles.headerAvatar}
              contentFit="cover"
              contentPosition="top center"
            />
          </View>
          <Text style={[styles.headerProfileName, { color }]}>{user?.name}</Text>
        </View>

        {/* WEEK VIEW */}
        <View style={styles.weekViewWrapper}>
          <WeekView showDescription={hasScheduleEvents} onDateChange={handleOnDateChange} />
        </View>

        {/* CONTENT BODY */}
        {!isLoading && (
          <>
            {hasScheduleEvents ? (
              <View style={{ flex: 1 }}>
                <View style={styles.tabsWrapper}>
                  <Tabs tabs={TABS} onTabChange={(tab) => handleOnTabChange(tab as TABS_VALUE)} />
                </View>
                <FlatList
                  style={{ flex: 1 }}
                  data={filterScheduleEvents}
                  extraData={onFocusTrigger}
                  renderItem={({ item }) => (
                    <MedicationCard
                      id={item.id}
                      imageUrl={item.medicationImageUrl}
                      name={item.medicationName}
                      profile={item.profile as ProfileResponse}
                      badge={getScheduleBadge(item)}
                      upcomingValue={getUpcomingTime(item.scheduleAt)}
                      dosage={item.dosage}
                      dosageUnit={getDosageUnit(item.measurement)}
                      scheduleTime={getScheduleTime(item.scheduleAt)}
                      takenAt={getTakenAt(item.takenAt)}
                      showEventButtons={showEventActionButton(item)}
                      onEventButtonPress={(action) => mutate({ id: item.id, action })}
                    />
                  )}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={[
                    styles.listContentContainer,
                    { paddingBottom: insets.bottom + 10 },
                  ]}
                />
              </View>
            ) : (
              <View style={styles.noContentWrapper}>
                <Image
                  source={require("@/assets/images/pill-bottle.png")}
                  style={styles.noContentImage}
                />
                <Text style={[styles.noContentTitle, { color }]}>
                  На этот день лекарства не запланированы
                </Text>
                <Text style={[styles.noContentSubtitle, { color: mutedColor }]}>
                  Если вы ещё не добавили лекарство, сделайте это сейчас.
                </Text>

                <CustomButton label="Добавить лекарства" svgIcon={<PlusIcon size={15} />} />
              </View>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    gap: 32,
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  headerProfileContainer: {
    width: 45,
    height: 45,
    borderRadius: 9999,
    overflow: "hidden",
  },
  headerAvatar: {
    width: "100%",
    height: "100%",
  },
  headerProfileName: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    lineHeight: 19.2,
  },
  weekViewWrapper: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  noContentWrapper: {
    flex: 1,
    gap: 20,
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
  },
  noContentImage: {
    width: 160,
    height: 160,
  },
  noContentTitle: {
    width: 250,
    fontFamily: "Roboto_500Medium",
    fontSize: 20,
    lineHeight: 24,
    textAlign: "center",
  },
  noContentSubtitle: {
    width: 250,
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
    lineHeight: 16.2,
    textAlign: "center",
  },
  tabsWrapper: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  listContentContainer: {
    paddingTop: 16,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 16,
    gap: 16,
  },
});
