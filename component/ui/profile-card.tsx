import { RELATION_LIST, Relation } from "@/constants/relation";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Pressable, StyleSheet, Text, View } from "react-native";
import PersonIcon from "../icons/person-icon";
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
  // Themes
  const color = useThemeColor({}, "textPrimary");
  const tintColor = useThemeColor({}, "tint");
  const bGColor = useThemeColor({}, "backgroundSecondary");
  const bGTertiary = useThemeColor({}, "backgroundTertiary");
  const borderColor = useThemeColor({}, "borderColor");

  const getRelationLabel = (value: string) => {
    return RELATION_LIST.find((list) => list.value === value)?.label;
  };

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
      <View style={[styles.profileIcon, { backgroundColor: bGTertiary }]}>
        <PersonIcon color="#fff" />
      </View>

      <View style={styles.profileTextWrapper}>
        <Text style={[styles.profileNameText, { color: isSelected ? "#F7F7F7" : color }]}>
          {isSelf ? "Для меня" : name}
        </Text>
        <Text style={[styles.profileRelationText, { color: isSelected ? "#F7F7F7" : color }]}>
          {isSelf ? "Вы" : getRelationLabel(relation || "")}
        </Text>
      </View>

      <View style={styles.profileActionsContainer}>
        {!isSelf && !asList && (
          <Pressable style={styles.changeSelectedProfile} onPress={changeProfile}>
            <Text style={styles.changeSelectedProfileText}>Изменить</Text>
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
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
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
