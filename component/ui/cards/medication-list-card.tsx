import { getDosageUnit } from "@/helpers/getDosageUnit";
import { getStartedDate } from "@/helpers/getStartedDate";
import { useThemeColor } from "@/hooks/use-theme-color";
import { MedicationProfile, Pack } from "@/types/medication";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Switch, Text, View } from "react-native";
import { useCardStyles } from "./use-card-style";

type MedicationListCardProps = {
  medicationProfile: MedicationProfile;
  onSwitchToggle: (status: "active" | "inactive", id: string) => void;
};

const getProgressText = (pack: Pack | null) => {
  if (!pack) return;
  const consumed = Number(pack.totalAmountInPack) - Number(pack.currentAmountInPack);
  return `${consumed} из ${pack.totalAmountInPack} принято`;
};

function getPercentage(pack: Pack | null) {
  if (!pack) return;
  const consumed = Number(pack.totalAmountInPack) - Number(pack.currentAmountInPack);
  return Math.round((consumed / Number(pack.totalAmountInPack)) * 100);
}

export default function MedicationListCard({
  medicationProfile,
  onSwitchToggle,
}: MedicationListCardProps) {
  const [isActive, setIsActive] = useState(medicationProfile.status.toUpperCase() === "ACTIVE");
  const router = useRouter();

  const sharedStyles = useCardStyles();
  const tintColor = useThemeColor({}, "tint");
  const bgTertiary = useThemeColor({}, "backgroundTertiary");

  const dosageUnit = getDosageUnit(medicationProfile.schedule.measurement);
  const startedDate = getStartedDate(medicationProfile.schedule.startDate);

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

  return (
    <View style={sharedStyles.card}>
      <View style={sharedStyles.cardInnerContainer}>
        <Pressable
          style={sharedStyles.cardContentRow}
          onPress={() => router.navigate(`/medications/${medicationProfile.id}`)}
        >
          {/* Image Wrapper */}
          <View style={sharedStyles.cardImageWrapper}>
            <Image
              source={require("@/assets/images/pill.png")}
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
            <Text style={sharedStyles.cardTextMedium}>Начало {startedDate}</Text>

            {!medicationProfile.profile.isSelf && (
              <View style={sharedStyles.profile}>
                <View style={sharedStyles.profileImage}>
                  <Text style={sharedStyles.profileImagePlaceholder}>
                    {medicationProfile.profile.name.charAt(0)}
                  </Text>
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
            <Text style={sharedStyles.progressTextValue}>
              {getProgressText(medicationProfile.pack)}
            </Text>
            <Text style={[sharedStyles.progressTextValue, { color: tintColor }]}>
              {getPercentage(medicationProfile.pack)}%
            </Text>
          </View>
          <View style={sharedStyles.progressPipe}>
            <View
              style={[
                sharedStyles.progressActivePipe,
                {
                  backgroundColor: tintColor,
                  width: `${getPercentage(medicationProfile.pack) ?? 0}%`,
                },
              ]}
            />
          </View>
        </View>
      )}
    </View>
  );
}
