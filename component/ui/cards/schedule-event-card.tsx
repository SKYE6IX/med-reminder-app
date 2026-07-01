import ClockIcon from "@/component/icons/clock-icon";
import { getDosageMeasurement } from "@/helpers/getDosageMeasurement";
import { getScheduleBadge } from "@/helpers/getScheduleBadge";
import { getScheduleTime } from "@/helpers/getScheduleTime";
import { getTakenAt } from "@/helpers/getTakenAt";
import { getUpcomingTime } from "@/helpers/getUpcomingTime";
import { useProfileImage } from "@/hooks/use-profile-image";
import { useThemeColor } from "@/hooks/use-theme-color";
import { MedicationScheduleEventResponse } from "@/types/medication";
import { DateTime, getTimeZone } from "@/utils/luxonUtil";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useCardStyles } from "./use-card-style";

type ScheduleEventCardProps = {
  scheduleEvent: MedicationScheduleEventResponse;
  onActionBtnPress: (action: "TAKEN" | "MISSED") => void;
};

const showEventButtons = (scheduleAt: string, status: string) => {
  if (!scheduleAt) {
    return false;
  }
  const now = DateTime.now();
  const scheduleTime = DateTime.fromISO(scheduleAt, {
    locale: "ru",
    setZone: true,
  });
  const isSameDay = now.hasSame(scheduleTime, "day");
  return isSameDay && !["TAKEN", "MISSED"].includes(status);
};

export default function ScheduleEventCard({
  scheduleEvent,
  onActionBtnPress,
}: ScheduleEventCardProps) {
  const [nowDate, setNowDate] = useState<DateTime>(DateTime.now().setZone(getTimeZone()));
  const { status, measurement, takenAt, scheduleAt, profile } = scheduleEvent;

  const profileImageUrl = useProfileImage(profile.id);

  useEffect(() => {
    let id: number;
    if (status === "PENDING") {
      id = setInterval(() => {
        setNowDate(DateTime.now().setZone(getTimeZone()));
      }, 1000);
    }
    return () => clearInterval(id);
  }, [status]);

  const sharedStyles = useCardStyles();
  const tintColor = useThemeColor({}, "tint");

  const dosageUnit = getDosageMeasurement(measurement);
  const takenAtValue = getTakenAt(takenAt);
  const scheduleTime = getScheduleTime(scheduleAt);

  const eventBadge = getScheduleBadge(scheduleAt, status, nowDate);
  const upcomingRemainTime = getUpcomingTime(scheduleAt, nowDate);
  const showEventBtn = showEventButtons(scheduleAt, status);

  const badgeBgColor =
    eventBadge === "taken" ? "#009E00" : eventBadge === "missed" ? "#DC0000" : tintColor;

  return (
    <View style={sharedStyles.card}>
      <View style={sharedStyles.cardInnerContainer}>
        {/* Image Wrapper */}
        <View style={sharedStyles.cardImageWrapper}>
          <Image
            source={require("@/assets/images/pill.png")}
            style={sharedStyles.cardImage}
            contentFit="contain"
            contentPosition="top center"
          />
        </View>

        {/* Content Wrapper */}
        <View style={sharedStyles.cardContent}>
          <Text style={sharedStyles.cardTextLarge}>{scheduleEvent.medicationName}</Text>
          <Text style={sharedStyles.cardTextMedium}>{`${scheduleEvent.dosage} ${dosageUnit}`}</Text>

          {takenAtValue ? (
            <Text style={sharedStyles.cardTextLarge}>{takenAtValue}</Text>
          ) : (
            <View style={sharedStyles.medicationSchedule}>
              <Text style={sharedStyles.medicationScheduleText}>{scheduleTime}</Text>
              <View style={sharedStyles.medicationScheduleDivider} />
              <Text style={sharedStyles.medicationScheduleText}>Ежедневно</Text>
            </View>
          )}

          {!scheduleEvent.profile.isSelf && (
            <View style={sharedStyles.profile}>
              <View style={sharedStyles.profileImage}>
                <Image source={profileImageUrl} contentFit="cover" style={sharedStyles.image} />
              </View>
              <Text style={sharedStyles.profileText}>{scheduleEvent.profile.name}</Text>
            </View>
          )}

          {showEventBtn && (
            <View style={sharedStyles.cardActionButtonWrapper}>
              <Pressable
                style={sharedStyles.cardActionButton}
                onPress={() => onActionBtnPress("TAKEN")}
              >
                <Text style={sharedStyles.cardActionButtonText}>Принять</Text>
              </Pressable>

              <Pressable
                style={[sharedStyles.cardActionButton, { backgroundColor: "#DC0000" }]}
                onPress={() => onActionBtnPress("MISSED")}
              >
                <Text style={sharedStyles.cardActionButtonText}>Пропустить</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>

      {eventBadge && (
        <View style={[sharedStyles.badge, { backgroundColor: badgeBgColor }]}>
          {/* Upcoming */}
          {eventBadge === "upcoming" && (
            <>
              <ClockIcon />
              <Text style={sharedStyles.badgeText}>{upcomingRemainTime}</Text>
            </>
          )}
          {/* Taken */}
          {eventBadge === "taken" && <Text style={sharedStyles.badgeText}>Принятые</Text>}
          {/* Missed */}
          {eventBadge === "missed" && <Text style={sharedStyles.badgeText}>Пропущенно</Text>}
        </View>
      )}
    </View>
  );
}
