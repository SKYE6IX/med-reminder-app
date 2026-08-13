import PlusIcon from "@/component/icons/plus-icon";
import CustomButton from "@/component/ui/custom-button/custom-button";
import Loader from "@/component/ui/loader";
import ScheduleEventList from "@/component/ui/schedule-event-list";
import SubscriptionBanner, { SubscriptionBannerRef } from "@/component/ui/subscription-banner";
import WeekView from "@/component/ui/week-view";
import { QueryKey } from "@/constants/query-keys";
import { useProfileImage } from "@/hooks/use-profile-image";
import { useSubscriptionPlanQuery } from "@/hooks/use-subscription-plan-query";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useUserQuery } from "@/hooks/use-user-data";
import { useTranslation } from "@/i18next/i18next";
import { useUserStore } from "@/stores/use-user-store";
import { ScheduleEventResponse } from "@/types/medication";
import { api } from "@/utils/axiosInstance";
import { getDefaultISODate } from "@/utils/luxonUtil";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Fetch schedule events query
const fetchScheduleEvents = async (params: string) => {
  const response = await api.get<ScheduleEventResponse[]>("medications/schedules/event", {
    params: {
      eventDate: params,
    },
  });
  return response.data;
};

export default function Home() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useUserQuery();
  const { isPremiumPlan } = useSubscriptionPlanQuery();
  const profileImageUrl = useProfileImage();

  const [selectedDate, setSelectedDate] = useState(getDefaultISODate());
  const subscriptionBannerRef = useRef<SubscriptionBannerRef>(null);

  // Show premimum plan offer once to newly user.
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    timeout = setTimeout(() => {
      if (!isPremiumPlan && useUserStore.getState().displaySubscriptioOffer) {
        subscriptionBannerRef.current?.openModal();
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [isPremiumPlan]);

  // Query schedule event list
  const { data, isLoading } = useQuery({
    queryKey: [QueryKey.scheduleEvents, selectedDate],
    queryFn: () => fetchScheduleEvents(selectedDate),
  });

  // Update schedule event
  const hasScheduleEvents = data && data.length >= 1 ? true : false;

  const handleOnDateChange = (isoDate: string) => {
    setSelectedDate(isoDate);
  };

  // Themes
  const color = useThemeColor({}, "textPrimary");
  const mutedColor = useThemeColor({}, "textMuted");
  const bgPrimary = useThemeColor({}, "backgroundPrimary");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgPrimary }} edges={["top"]}>
      <Loader visible={isLoading} />
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerProfileContainer}>
            <Image
              source={profileImageUrl}
              style={styles.headerAvatar}
              contentFit="cover"
              contentPosition="top center"
            />
          </View>
          <Text style={[styles.headerProfileName, { color }]}>{user?.name}</Text>
        </View>

        {/* WEEK VIEW */}
        <WeekView showDescription={hasScheduleEvents} onDateChange={handleOnDateChange} />

        {/* CONTENT DATA */}
        {!isLoading && data && data.length >= 1 && (
          <ScheduleEventList data={data} selectedDate={selectedDate} />
        )}

        {/* NO CONTENT*/}
        {!isLoading && data && data.length <= 0 && (
          <View style={styles.noContentWrapper}>
            <Image
              source={require("@/assets/images/pill-bottle.png")}
              style={styles.noContentImage}
            />
            <Text style={[styles.noContentTitle, { color }]}>
              {t("home_screen.no_content_heading")}
            </Text>
            <Text style={[styles.noContentSubtitle, { color: mutedColor }]}>
              {t("home_screen.no_content_body")}
            </Text>
            <CustomButton
              label={t("common.add_medication")}
              svgIcon={<PlusIcon size={15} />}
              onPress={() => router.navigate("/(tabs)/add-medication")}
            />
          </View>
        )}
      </View>

      <SubscriptionBanner ref={subscriptionBannerRef} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
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
});
