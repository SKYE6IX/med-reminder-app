import { DOSAGE_UNITS } from "@/constants/schedule-options";
import { useThemeColor } from "@/hooks/use-theme-color";
import { DosageMeasurement } from "@/types/medication";
import { Pressable, StyleSheet, Text, View } from "react-native";
import MinusIcon from "../icons/minus-icon";
import PlusIcon from "../icons/plus-icon";

type DosageSettingsProps = {
  dosageAmountState: number;
  dosageUnitState: DosageMeasurement;
  showUnitForm?: boolean;
  onDasgeSettingsChange: ({
    amount,
    unit,
  }: Partial<{ amount: number; unit: DosageMeasurement }>) => void;
};

export default function DosageSettings({
  dosageAmountState,
  dosageUnitState,
  onDasgeSettingsChange,
  showUnitForm = true,
}: DosageSettingsProps) {
  // Themes color
  const color = useThemeColor({}, "textPrimary");
  const bGColor = useThemeColor({}, "backgroundSecondary");
  const bGTertiary = useThemeColor({}, "backgroundTertiary");
  const borderColor = useThemeColor({}, "borderColor");
  const tintColor = useThemeColor({}, "tint");

  const handleSetDosageUnit = (unit: DosageMeasurement) => {
    onDasgeSettingsChange({ unit });
  };

  const increaseDosageAmount = () => {
    const amount = Math.round((dosageAmountState + 0.5) * 10) / 10;
    onDasgeSettingsChange({ amount });
  };

  const decreaseDosageAmount = () => {
    const amount = Math.max(1, Math.round((dosageAmountState - 0.5) * 10) / 10);
    onDasgeSettingsChange({ amount });
  };

  return (
    <View style={[styles.container, { borderColor, backgroundColor: bGColor }]}>
      <View style={styles.topView}>
        <Text style={[styles.label, { color }]}>Доза за приём</Text>
        <View style={styles.dosageAmountWrapper}>
          <Pressable
            style={[styles.dosageAmountPressable, { backgroundColor: bGTertiary }]}
            onPress={decreaseDosageAmount}
            disabled={dosageAmountState <= 1}
          >
            <MinusIcon color={color} width={20} height={4} />
          </Pressable>
          <Text style={[styles.dosageAmountValue, { color: tintColor }]}>
            {dosageAmountState % 1 === 0 ? dosageAmountState : dosageAmountState.toFixed(1)}
          </Text>
          <Pressable
            style={[styles.dosageAmountPressable, { backgroundColor: bGTertiary }]}
            onPress={increaseDosageAmount}
          >
            <PlusIcon color={color} size={20} />
          </Pressable>
        </View>
      </View>

      {showUnitForm && (
        <View style={styles.bodyView}>
          <Text style={[styles.label, { color }]}>Форма лекарства</Text>
          <View style={styles.dosageUnitWrapper}>
            {DOSAGE_UNITS.map((unit) => {
              const isSelected = unit.value === dosageUnitState.toUpperCase();
              return (
                <Pressable
                  key={unit.value}
                  style={[
                    styles.dosageUnitPressabale,
                    {
                      borderWidth: isSelected ? undefined : 1,
                      borderColor,
                      backgroundColor: isSelected ? tintColor : undefined,
                    },
                  ]}
                  onPress={() => handleSetDosageUnit(unit.value)}
                >
                  <Text style={styles.dosageUnitIcon}>{unit.icon}</Text>
                  <Text style={[styles.dosageUnitLabel, { color: isSelected ? "#fff" : color }]}>
                    {unit.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    gap: 16,
  },
  topView: {
    gap: 12,
  },
  bodyView: {
    gap: 12,
  },
  label: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    lineHeight: 16.2,
  },
  dosageAmountWrapper: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  dosageAmountPressable: {
    width: 48,
    height: 48,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  dosageAmountValue: {
    width: 80,
    textAlign: "center",
    fontFamily: "Roboto_600SemiBold",
    fontSize: 36,
    lineHeight: 40,
  },
  dosageUnitWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 8,
  },
  dosageUnitPressabale: {
    width: 103,
    height: 75,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    gap: 4,
  },
  dosageUnitLabel: {
    fontFamily: "Roboto_400Regular",
    fontSize: 12,
    lineHeight: 14.2,
  },
  dosageUnitIcon: {
    fontSize: 20,
    lineHeight: 24,
  },
});
