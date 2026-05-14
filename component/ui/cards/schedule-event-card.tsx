import ClockIcon from "@/component/icons/clock-icon";
import { getDosageUnit } from "@/helpers/getDosageUnit";
import { getScheduleBadge } from "@/helpers/getScheduleBadge";
import { getTakenAt } from "@/helpers/getTakenAt";
import { showEventActionButton } from "@/helpers/showEventActionButton";
import { useThemeColor } from "@/hooks/use-theme-color";
import { MedicationSchedule } from "@/types/medication";
import { getUpcomingTime, toLocalTime } from "@/utils/luxonUtil";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import { useCardStyles } from "./use-card-style";

type ScheduleEventCardProps = {
  scheduleEvent: MedicationSchedule;
  onActionBtnPress: (action: "TAKEN" | "MISSED") => void;
};

const getScheduleTime = (scheduleTime: string) => {
  const date = new Date(scheduleTime);
  return toLocalTime(date);
};

export default function ScheduleEventCard({
  scheduleEvent,
  onActionBtnPress,
}: ScheduleEventCardProps) {
  const sharedStyles = useCardStyles();
  const tintColor = useThemeColor({}, "tint");

  const dosageUnit = getDosageUnit(scheduleEvent.measurement);
  const takenAt = getTakenAt(scheduleEvent.takenAt);
  const scheduleTime = getScheduleTime(scheduleEvent.scheduleAt);
  const showActionBtns = showEventActionButton(scheduleEvent);
  const eventBadge = getScheduleBadge(scheduleEvent);
  const upcomingRemainTime = getUpcomingTime(scheduleEvent.scheduleAt);

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

          {takenAt ? (
            <Text style={sharedStyles.cardTextLarge}>{takenAt}</Text>
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
