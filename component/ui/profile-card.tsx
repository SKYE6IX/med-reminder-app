import { Relation, relationList } from "@/constants/relation";
import { useProfileImage } from "@/hooks/use-profile-image";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useTranslation } from "@/i18next/i18next";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";
import SelectionDot from "./selection-dot";

type ProfileCardProps = {
  profileId: string;
  name?: string;
  relation?: Relation;
  isSelf: boolean;
  hasActiveDot: boolean;
  asList?: boolean;
  isSelected: boolean;
  setProfile: (profileId: string) => void;
  changeProfile?: () => void;
};

export default function ProfileCard({
  profileId,
  name,
  relation,
  hasActiveDot,
  isSelf,
  setProfile,
  changeProfile,
  asList,
  isSelected,
}: ProfileCardProps) {
  const { t, i18n } = useTranslation();
  const RELATION_LIST = relationList(i18n.language);

  const profileImageUrl = useProfileImage(!isSelf ? profileId : "");
  const getRelationLabel = (value: string) => {
    return RELATION_LIST.find((list) => list.value === value)?.label;
  };

  // Themes
  const color = useThemeColor({}, "textPrimary");
  const tintColor = useThemeColor({}, "tint");
  const bGColor = useThemeColor({}, "backgroundSecondary");
  const borderColor = useThemeColor({}, "borderColor");

  return (
    <Pressable
      style={[
        styles.profilePressable,
        {
          borderColor,
          backgroundColor: isSelected ? tintColor : bGColor,
          borderWidth: isSelected ? 0 : 1,
        },
      ]}
      onPress={() => setProfile(profileId)}
    >
      <View style={[styles.profileImage]}>
        <Image source={profileImageUrl} contentFit="cover" style={styles.image} />
      </View>

      <View style={styles.profileTextWrapper}>
        <Text style={[styles.profileNameText, { color: isSelected ? "#F7F7F7" : color }]}>
          {isSelf ? t("profile_card.for_me") : name}
        </Text>
        <Text style={[styles.profileRelationText, { color: isSelected ? "#F7F7F7" : color }]}>
          {isSelf ? t("profile_card.you") : getRelationLabel(relation || "")}
        </Text>
      </View>

      <View style={styles.profileActionsContainer}>
        {!isSelf && !asList && (
          <Pressable style={styles.changeSelectedProfile} onPress={changeProfile}>
            <Text style={styles.changeSelectedProfileText}>{t("profile_card.change")}</Text>
          </Pressable>
        )}
        {hasActiveDot && <SelectionDot isActive={isSelected} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  profilePressable: {
    width: "100%",
    height: 65,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
  },
  profileTextWrapper: {
    gap: 4,
  },
  profileNameText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 15,
    lineHeight: 17.2,
  },
  profileRelationText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    lineHeight: 16.2,
  },
  profileActionsContainer: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  changeSelectedProfile: {
    marginLeft: "auto",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 16,
    backgroundColor: "#FFFFFF33",
  },
  changeSelectedProfileText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    lineHeight: 16.2,
    color: "#F7F7F7",
  },
});
