import { useProfileImage } from "@/hooks/use-profile-image";
import { useThemeColor } from "@/hooks/use-theme-color";
import { MedicationProfile } from "@/types/medication";
import { Image } from "expo-image";
import { useState } from "react";
import { Switch, Text, View } from "react-native";
import { useCardStyles } from "./use-card-style";

type MedicationDetailCardProps = {
  medicationProfile: MedicationProfile;
  onSwitchToggle: (status: "active" | "inactive", id: string) => void;
};

export default function MedicationDetailCard({
  medicationProfile,
  onSwitchToggle,
}: MedicationDetailCardProps) {
  const [isActive, setIsActive] = useState(medicationProfile.status.toUpperCase() === "ACTIVE");
  const profileImageUrl = useProfileImage(medicationProfile.profile.id);

  const sharedStyles = useCardStyles();
  const tintColor = useThemeColor({}, "tint");
  const bgTertiary = useThemeColor({}, "backgroundTertiary");

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

          {!medicationProfile.profile.isSelf && (
            <View style={sharedStyles.profile}>
              <View style={sharedStyles.profileImage}>
                <Image source={profileImageUrl} contentFit="cover" style={sharedStyles.image} />
              </View>
              <Text style={sharedStyles.profileText}>{medicationProfile.profile.name}</Text>
            </View>
          )}
        </View>

        <Switch
          onValueChange={handleToggleSwitch}
          value={isActive}
          trackColor={{ false: bgTertiary, true: tintColor }}
          thumbColor="#F7F7F7"
          style={{ marginLeft: "auto" }}
        />
      </View>
    </View>
  );
}
