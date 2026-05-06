import ArrowRight from "@/component/icons/arrow-right";
import PillIcon from "@/component/icons/pill-icon";
import { DOSAGE_UNITS } from "@/constants/schedule-options";
import { useThemeColor } from "@/hooks/use-theme-color";
import { MedicationProfileResponse } from "@/types/medication";
import { Pressable, Text, View } from "react-native";
import { useSharedStyles } from "./use-shared-styles";

const getDosageUnit = (value: string) => {
  const label = DOSAGE_UNITS.find((unit) => unit.value === value.toUpperCase())?.label;
  return label;
};

export default function DosageSettings({
  medicationProfile,
}: {
  medicationProfile: MedicationProfileResponse;
}) {
  const sharedStyles = useSharedStyles();
  const color = useThemeColor({}, "textPrimary");
  return (
    <Pressable style={[sharedStyles.card, sharedStyles.detailsGroupItem]}>
      <View style={sharedStyles.cardHeader}>
        <Text style={sharedStyles.cardTitle}>Доза за прием</Text>
        <ArrowRight color={color} />
      </View>
      <View style={sharedStyles.cardBody}>
        <PillIcon color={color} size={16} />
        <Text style={sharedStyles.cardTextContent}>
          {`${medicationProfile.schedule.dosage} ${getDosageUnit(medicationProfile.schedule.measurement)}`}
        </Text>
      </View>
    </Pressable>
  );
}
