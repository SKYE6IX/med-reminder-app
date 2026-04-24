import { useThemeColor } from "@/hooks/use-theme-color";
import { ProfileResponse } from "@/types/medication";
import { Image } from "expo-image";
import { useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

type MedicationCardProps = {
  imageUrl?: string;
  name: string;
  profile: ProfileResponse;
  dosage?: number;
  dosageUnit?: string;
  freq?: string;
  hasBadge?: boolean;
  hasSwitch?: boolean;
  showProgress?: boolean;
  startedDate?: string;
  handlePressButton: () => void;
  handleToggleSwitch: () => void;
};

export default function MedicationCard() {
  const [toggleSwitch, setToggleSwitch] = useState(false);

  const color = useThemeColor({}, "textPrimary");
  const tintColor = useThemeColor({}, "tint");
  const mutedColor = useThemeColor({}, "textMuted");
  const bgSecondary = useThemeColor({}, "backgroundSecondary");
  const bgTertiary = useThemeColor({}, "backgroundTertiary");

  const handleToggleSwitch = () => {
    setToggleSwitch(!toggleSwitch);
  };

  return (
    <View style={[styles.card, { backgroundColor: bgSecondary }]}>
      <View style={styles.cardInnerContainer}>
        {/* Image Wrapper */}
        <View
          style={[styles.cardImageWrapper, { backgroundColor: bgTertiary }]}
        >
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
          <View style={styles.cardContentInner}>
            <Text style={[styles.medicationName, { color }]}>Метформин</Text>

            {/* Dosage */}
            <Text style={[styles.medicationDosage, { color }]}>1 капсула</Text>

            {/* Schedule */}
            <View style={styles.medicationSchedule}>
              <Text style={[styles.medicationScheduleText, { color }]}>
                09:00
              </Text>
              <View
                style={[
                  styles.medicationScheduleDivider,
                  { backgroundColor: mutedColor },
                ]}
              />
              <Text style={[styles.medicationScheduleText, { color }]}>
                Ежедневно
              </Text>
            </View>

            {/* Starting date */}
            <Text style={[styles.medicationStartDate, { color }]}>
              Начало 25 июля
            </Text>

            <View style={styles.cardContentWrapperBottom}>
              {/* Profile, not shown for self owner */}
              <View style={styles.profile}>
                <View style={[styles.profileImage]}>
                  <Text style={[styles.profileImagePlaceholder, { color }]}>
                    Л
                  </Text>
                </View>
                <Text style={[styles.profileText, { color }]}>Людмила</Text>
              </View>

              {/* Action button */}
              {/* <Pressable
                style={[styles.cardButton, { backgroundColor: tintColor }]}
              >
                <Text style={styles.cardButtonText}>Принять</Text>
              </Pressable> */}
            </View>
          </View>

          {/* Switch */}
          <Switch
            onValueChange={handleToggleSwitch}
            value={toggleSwitch}
            trackColor={{ false: bgTertiary, true: tintColor }}
            thumbColor="#F7F7F7"
          />
        </View>
      </View>

      {/* Badge */}
      {/* <View style={[styles.badge, { backgroundColor: tintColor }]}> */}
      {/* Upcoming  tintColor*/}
      {/* <ClockIcon />
        <Text style={styles.badgeText}>2ч 23м</Text> */}

      {/* Taken #009E00 */}
      {/* <Text style={styles.badgeText}>Принятые</Text> */}

      {/* Missed #DC0000 */}
      {/* <Text style={styles.badgeText}>Пропущенно</Text> */}
      {/* </View> */}

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressTextValue, { color: mutedColor }]}>
            25 из 60 принято
          </Text>
          <Text style={[styles.progressTextValue, { color: tintColor }]}>
            42%
          </Text>
        </View>
        <View style={[styles.progressPipe, { backgroundColor: bgTertiary }]}>
          <View
            style={[styles.progressActivePipe, { backgroundColor: tintColor }]}
          />
        </View>
      </View>
      {/* <View
        pointerEvents="none"
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: "#9E9E9E",
          opacity: 0.5,
        }}
      /> */}
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
    // opacity: 0.5,
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
