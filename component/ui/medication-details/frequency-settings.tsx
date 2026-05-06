import AlarmClockIcon from "@/component/icons/alarm-clock-icon";
import ArrowRight from "@/component/icons/arrow-right";
import { useThemeColor } from "@/hooks/use-theme-color";
import { MedicationProfileResponse } from "@/types/medication";
import { Pressable, Text, View } from "react-native";
import { useSharedStyles } from "./use-shared-styles";

export default function FrequencySettings({
  medicationProfile,
}: {
  medicationProfile: MedicationProfileResponse;
}) {
  const sharedStyles = useSharedStyles();
  const color = useThemeColor({}, "textPrimary");
  return (
    <Pressable style={sharedStyles.card}>
      <View style={sharedStyles.cardHeader}>
        <Text style={sharedStyles.cardTitle}>Частота приема</Text>
        <ArrowRight color={color} />
      </View>
      <View style={sharedStyles.cardBody}>
        <AlarmClockIcon color={color} />
        <Text style={sharedStyles.cardTextContent}>Каждые 6 часов, 3 раза в день</Text>
      </View>
    </Pressable>
  );
}
