import ClockIcon from "@/component/icons/clock-icon";
import { DOSAGE_UNITS } from "@/constants/schedule-options";
import { useThemeColor } from "@/hooks/use-theme-color";
import { DosageMeasurement, ProfileResponse } from "@/types/medication";
import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

type MedicationCardProps = {
  imageUrl: string;
  name: string;
  profile: ProfileResponse;
  dosage?: number;
  dosageUnit?: DosageMeasurement;
  scheduleTime?: string;
  freq?: string;
  badge?: "upcoming" | "taken" | "missed";
  hasSwitch?: boolean;
  showProgress?: boolean;
  startedDate?: string;
  isActive?: boolean;
  onButtonPress?: () => void;
  onSwitchToggle?: (status: "active" | "inactive") => void;
  onNavigate?: () => void;
};

export default function MedicationCard({
  imageUrl,
  name,
  profile,
  dosage,
  dosageUnit,
  scheduleTime,
  freq,
  badge,
  hasSwitch,
  showProgress,
  startedDate,
  isActive,
  onButtonPress,
  onSwitchToggle,
  onNavigate,
}: MedicationCardProps) {
  const [toggleSwitch, setToggleSwitch] = useState(isActive);

  // Themes color
  const color = useThemeColor({}, "textPrimary");
  const tintColor = useThemeColor({}, "tint");
  const mutedColor = useThemeColor({}, "textMuted");
  const bgSecondary = useThemeColor({}, "backgroundSecondary");
  const bgTertiary = useThemeColor({}, "backgroundTertiary");

  const handleToggleSwitch = () => {
    const isToggle = !toggleSwitch;

    if (isToggle && onSwitchToggle) {
      onSwitchToggle("active");
    } else if (!isToggle && onSwitchToggle) {
      onSwitchToggle("inactive");
    }

    setToggleSwitch(isToggle);
  };

  const getDosage = () => {
    const label = DOSAGE_UNITS.find((unit) => unit.value === dosageUnit)?.label;
    return `${dosage + " " + label}`;
  };

  const badgeBgColor = badge === "taken" ? "#009E00" : badge === "missed" ? "#DC0000" : tintColor;

  return (
    <View style={[styles.card, { backgroundColor: bgSecondary }]}>
      <View style={styles.cardInnerContainer}>
        {/* Image Wrapper */}
        <View style={[styles.cardImageWrapper, { backgroundColor: bgTertiary }]}>
          <Image
            source={require("@/assets/images/pill.png")}
            style={styles.cardImage}
            contentFit="contain"
            contentPosition="top center"
          />
        </View>

        {/* Content Wrapper */}
        <View style={styles.cardContentContainer}>
          {/* Inner wrapper */}
          <Pressable style={styles.cardContentInner} onPress={onNavigate}>
            <Text style={[styles.medicationName, { color }]}>{name}</Text>

            {/* Dosage */}
            {dosage && <Text style={[styles.medicationDosage, { color }]}>{getDosage()}</Text>}

            {/* Schedule */}
            {scheduleTime && (
              <View style={styles.medicationSchedule}>
                <Text style={[styles.medicationScheduleText, { color }]}>{scheduleTime}</Text>
                <View style={[styles.medicationScheduleDivider, { backgroundColor: mutedColor }]} />
                <Text style={[styles.medicationScheduleText, { color }]}>Ежедневно</Text>
              </View>
            )}

            {/* Starting date */}
            {startedDate && (
              <Text style={[styles.medicationStartDate, { color }]}>Начало {startedDate}</Text>
            )}

            <View style={styles.cardContentWrapperBottom}>
              {/* Profile, not shown for self owner */}
              {!profile.isSelf && (
                <View style={styles.profile}>
                  <View style={[styles.profileImage]}>
                    <Text style={[styles.profileImagePlaceholder, { color }]}>
                      {profile.name.charAt(0)}
                    </Text>
                  </View>
                  <Text style={[styles.profileText, { color }]}>{profile.name}</Text>
                </View>
              )}
              {/* Action button */}
              {/* <Pressable
                style={[styles.cardButton, { backgroundColor: tintColor }]}
              >
                <Text style={styles.cardButtonText}>Принять</Text>
              </Pressable> */}
            </View>
          </Pressable>

          {/* Switch */}
          {hasSwitch && (
            <Switch
              onValueChange={handleToggleSwitch}
              value={toggleSwitch}
              trackColor={{ false: bgTertiary, true: tintColor }}
              thumbColor="#F7F7F7"
            />
          )}
        </View>
      </View>

      {/* Badge */}
      {badge && (
        <View style={[styles.badge, { backgroundColor: badgeBgColor }]}>
          {/* Upcoming  tintColor*/}
          {badge === "upcoming" && (
            <>
              <ClockIcon />
              <Text style={styles.badgeText}>2ч 23м</Text>
            </>
          )}

          {/* Taken #009E00 */}
          {badge === "taken" && <Text style={styles.badgeText}>Принятые</Text>}

          {/* Missed #DC0000 */}
          {badge === "missed" && <Text style={styles.badgeText}>Пропущенно</Text>}
        </View>
      )}

      {/* Progress Bar */}
      {showProgress && (
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressTextValue, { color: mutedColor }]}>25 из 60 принято</Text>
            <Text style={[styles.progressTextValue, { color: tintColor }]}>42%</Text>
          </View>
          <View style={[styles.progressPipe, { backgroundColor: bgTertiary }]}>
            <View style={[styles.progressActivePipe, { backgroundColor: tintColor }]} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 120,
    borderRadius: 16,
    padding: 16,
    position: "relative",
    gap: 16,
  },
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  cardInnerContainer: {
    flexDirection: "row",
    gap: 10,
  },
  cardImageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardContentContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardContentInner: {
    gap: 8,
  },
  medicationName: {
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
    lineHeight: 19.2,
  },
  medicationDosage: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    lineHeight: 16.2,
    textTransform: "lowercase",
  },
  medicationSchedule: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  medicationScheduleText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
    lineHeight: 16.2,
  },
  medicationScheduleDivider: {
    width: 1.5,
    height: 16,
  },
  medicationStartDate: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    lineHeight: 16.2,
  },
  cardContentWrapperBottom: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  profile: {
    flexDirection: "row",
    gap: 4,
  },
  profileImage: {
    width: 15,
    height: 15,
    borderRadius: 999,
    backgroundColor: "#90A8F06E",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImagePlaceholder: {
    fontFamily: "Roboto_400Regular",
    fontSize: 10,
    lineHeight: 11,
  },
  profileText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 12,
    lineHeight: 14.2,
  },
  badge: {
    width: 90,
    height: 25,
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    right: 0,
    top: 0,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
  },
  badgeText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 12,
    lineHeight: 14.2,
    color: "#F7F7F7",
  },
  cardButton: {
    width: 100,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  cardButtonText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 12,
    lineHeight: 14.2,
    color: "#F7F7F7",
  },
  progressContainer: {
    gap: 5,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressTextValue: {
    fontFamily: "Roboto_400Regular",
    fontSize: 13,
    lineHeight: 14.2,
  },
  progressPipe: {
    height: 5,
    width: "100%",
    borderRadius: 35,
    position: "relative",
  },
  progressActivePipe: {
    position: "absolute",
    height: 5,
    width: "50%",
    borderRadius: 35,
    top: 0,
    left: 0,
  },
});
