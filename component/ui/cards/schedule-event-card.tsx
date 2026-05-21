import ClockIcon from "@/component/icons/clock-icon";
import { getDosageUnit } from "@/helpers/getDosageUnit";
import { getScheduleBadge } from "@/helpers/getScheduleBadge";
import { getScheduleTime } from "@/helpers/getScheduleTime";
import { getTakenAt } from "@/helpers/getTakenAt";
import { getUpcomingTime } from "@/helpers/getUpcomingTime";
import { showEventActionButton } from "@/helpers/showEventActionButton";
import { useThemeColor } from "@/hooks/use-theme-color";
import { MedicationScheduleEvent } from "@/types/medication";
import { DateTime, getTimeZone } from "@/utils/luxonUtil";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useCardStyles } from "./use-card-style";

type ScheduleEventCardProps = {
  scheduleEvent: MedicationScheduleEvent;
  onActionBtnPress: (action: "TAKEN" | "MISSED") => void;
};

export default function ScheduleEventCard({
  scheduleEvent,
  onActionBtnPress,
}: ScheduleEventCardProps) {
  const [nowDate, setNowDate] = useState<DateTime>(DateTime.now().setZone(getTimeZone()));
  const { status, measurement, takenAt, scheduleAt } = scheduleEvent;

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

  const dosageUnit = getDosageUnit(measurement);
  const takenAtValue = getTakenAt(takenAt);
  const scheduleTime = getScheduleTime(scheduleAt);

  const showActionBtns = showEventActionButton(scheduleAt, status, nowDate);
  const eventBadge = getScheduleBadge(scheduleAt, status, nowDate);
  const upcomingRemainTime = getUpcomingTime(scheduleAt, nowDate);

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
                <Text style={sharedStyles.profileImagePlaceholder}>
                  {scheduleEvent.profile.name.charAt(0)}
                </Text>
              </View>
              <Text style={sharedStyles.profileText}>{scheduleEvent.profile.name}</Text>
            </View>
          )}

          {showActionBtns && (
            <View style={sharedStyles.cardActionButtons}>
              <Pressable style={sharedStyles.cardButton} onPress={() => onActionBtnPress("TAKEN")}>
                <Text style={sharedStyles.cardButtonText}>Принять</Text>
              </Pressable>
              <Pressable
                style={[sharedStyles.cardButton, { backgroundColor: "#DC0000" }]}
                onPress={() => onActionBtnPress("MISSED")}
              >
                <Text style={sharedStyles.cardButtonText}>Пропустить</Text>
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
