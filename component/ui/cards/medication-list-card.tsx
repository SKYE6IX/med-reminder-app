import { getDosageMeasurement } from "@/helpers/getDosageMeasurement";
import { getDurationDate } from "@/helpers/getDurationDate";
import { useProfileImage } from "@/hooks/use-profile-image";
import { useThemeColor } from "@/hooks/use-theme-color";
import { lng, useTranslation } from "@/i18next/i18next";
import { MedicationProfileReponse } from "@/types/medication";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { useCardStyles } from "./use-card-style";

type MedicationListCardProps = {
  medicationProfile: MedicationProfileReponse;
  onSwitchToggle: (status: "active" | "inactive", id: string) => void;
};

const getProgressText = (medicationProfile: MedicationProfileReponse) => {
  if (!medicationProfile.pack) return;
  const pack = medicationProfile.pack;
  const consumed = Number(pack.totalAmountInPack) - Number(pack.currentAmountInPack);
  const isRU = lng === "ru";
  return `${consumed} ${isRU ? "из" : "of"} ${pack.totalAmountInPack} ${isRU ? "принято" : "taken"}`;
};

function getPercentage(medicationProfile: MedicationProfileReponse) {
  if (!medicationProfile.pack) return;
  const pack = medicationProfile.pack;
  const consumed = Number(pack.totalAmountInPack) - Number(pack.currentAmountInPack);
  return Math.round((consumed / Number(pack.totalAmountInPack)) * 100);
}

export default function MedicationListCard({
  medicationProfile,
  onSwitchToggle,
}: MedicationListCardProps) {
  const { t } = useTranslation();
  const sharedStyles = useCardStyles();
  const profileImageUrl = useProfileImage(medicationProfile.profile.id);

  const [isActive, setIsActive] = useState(medicationProfile.status.toUpperCase() === "ACTIVE");
  const router = useRouter();

  const dosageUnit = getDosageMeasurement(medicationProfile.schedule.measurement);
  const startedDate = getDurationDate(medicationProfile.schedule.startDate);

  const canShowProgress = medicationProfile.pack !== null;

  const handleToggleSwitch = () => {
    const isToggle = !isActive;
    if (isToggle) {
      onSwitchToggle("active", medicationProfile.id);
    } else if (!isToggle) {
      onSwitchToggle("inactive", medicationProfile.id);
    }
    setIsActive(isToggle);
  };

  const tintColor = useThemeColor({}, "tint");
  const bgTertiary = useThemeColor({}, "backgroundTertiary");
  const disableCard = useThemeColor({}, "disableCard");

  return (
    <View style={sharedStyles.card}>
      {medicationProfile.status === "in_active" && (
        <View
          style={{
            ...StyleSheet.absoluteFill,
            backgroundColor: disableCard,
            zIndex: 1,
            borderRadius: 16,
          }}
          pointerEvents="none"
        />
      )}

      <View style={sharedStyles.cardInnerContainer}>
        <Pressable
          style={sharedStyles.cardContentRow}
          onPress={() => router.navigate(`/medications/${medicationProfile.id}`)}
        >
          {/* Image Wrapper */}
          <View style={sharedStyles.cardImageWrapper}>
            <Image
              source={require("@/assets/images/pill-bottle.png")}
              style={sharedStyles.cardImage}
              contentFit="contain"
              contentPosition="top center"
            />
          </View>

          {/* Contents */}
          <View style={sharedStyles.cardContent}>
            <Text style={sharedStyles.cardTextLarge}>{medicationProfile.medicationName}</Text>
            <Text
              style={sharedStyles.cardTextMedium}
            >{`${medicationProfile.schedule.dosage} ${dosageUnit}`}</Text>
            <Text style={sharedStyles.cardTextMedium}>
              {t("medication_screen.list_card_start_at", { date: startedDate })}
            </Text>
            {!medicationProfile.profile.isSelf && (
              <View style={sharedStyles.profile}>
                <View style={sharedStyles.profileImage}>
                  <Image source={profileImageUrl} contentFit="cover" style={sharedStyles.image} />
                </View>
                <Text style={sharedStyles.profileText}>{medicationProfile.profile.name}</Text>
              </View>
            )}
          </View>
        </Pressable>

        <Switch
          onValueChange={handleToggleSwitch}
          value={isActive}
          trackColor={{ false: bgTertiary, true: tintColor }}
          thumbColor="#F7F7F7"
          style={{ marginLeft: "auto" }}
        />
      </View>

      {/* Progress tracker */}
      {canShowProgress && (
        <View style={sharedStyles.progressContainer}>
          <View style={sharedStyles.progressHeader}>
            <Text style={sharedStyles.progressTextValue}>{getProgressText(medicationProfile)}</Text>
            <Text style={[sharedStyles.progressTextValue, { color: tintColor }]}>
              {getPercentage(medicationProfile)}%
            </Text>
          </View>
          <View style={sharedStyles.progressPipe}>
            <View
              style={[
                sharedStyles.progressActivePipe,
                {
                  backgroundColor: tintColor,
                  width: `${getPercentage(medicationProfile) ?? 0}%`,
                },
              ]}
            />
          </View>
        </View>
      )}
    </View>
  );
}
