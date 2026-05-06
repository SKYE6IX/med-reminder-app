import ArrowRight from "@/component/icons/arrow-right";
import NoteIcon from "@/component/icons/note-icon";
import { useThemeColor } from "@/hooks/use-theme-color";
import { MedicationProfileResponse } from "@/types/medication";
import { Pressable, Text, View } from "react-native";
import { useSharedStyles } from "./use-shared-styles";

export default function NoteSettings({
  medicationProfile,
}: {
  medicationProfile: MedicationProfileResponse;
}) {
  const sharedStyles = useSharedStyles();
  const color = useThemeColor({}, "textPrimary");
  const mutedColor = useThemeColor({}, "textMuted");
  return (
    <Pressable style={sharedStyles.card}>
      <View style={sharedStyles.cardHeader}>
        <Text style={sharedStyles.cardTitle}>Заметки</Text>
        <ArrowRight color={color} />
      </View>
      <View style={sharedStyles.cardBody}>
        <NoteIcon color={color} />
        <Text style={[sharedStyles.cardTextContent, { color: mutedColor }]}>
          {medicationProfile.note ? medicationProfile.note : "Добавьте заметку..."}
        </Text>
      </View>
    </Pressable>
  );
}
