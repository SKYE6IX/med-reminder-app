import { DOSAGE_MEASUREMENT } from "@/constants/medication-constants";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAddPillStore } from "@/stores/add-pill-store";
import { DosageMeasurement } from "@/types/medication";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BottomSheetWrapperRef } from "../bottom-sheet-wrapper";
import DosageAmountInput from "./dosage-amount-input";

const UNIT_PRESSABLE_PER_ROW = 3;
const UNIT_WRAPPER_GAP = 12;

export default function DosageAmounPicker() {
  const [unitWrapperWidth, setUnitWrapperWidth] = useState(0);

  const showDosageAmountInputRef = useRef<BottomSheetWrapperRef>(null);
  const { formState, setMedicatioSchedule, setMedicationDetails } = useAddPillStore();

  const dosageAmountState = Number(formState.schedule.dosage);
  const dosageMeasurements = formState.medicationMeasurement;

  const UNIT_PRESSABLE_WIDTH = (unitWrapperWidth - UNIT_WRAPPER_GAP * 2) / UNIT_PRESSABLE_PER_ROW;

  const handleSetDosageUnit = (measurement: DosageMeasurement) => {
    setMedicationDetails({ medicationMeasurement: measurement });
  };
  const handleSetDosageAmount = (amount: string) => {
    setMedicatioSchedule({ dosage: amount });
  };

  // Themes color
  const color = useThemeColor({}, "textPrimary");
  const bGColor = useThemeColor({}, "backgroundSecondary");
  const bGTertiary = useThemeColor({}, "backgroundTertiary");
  const borderColor = useThemeColor({}, "borderColor");
  const tintColor = useThemeColor({}, "tint");

  return (
    <View style={[styles.container, { borderColor, backgroundColor: bGColor }]}>
      <View style={styles.topView}>
        <Text style={[styles.label, { color }]}>Доза за приём</Text>

        <View style={styles.dosageAmountWrapper}>
          <Pressable
            style={[styles.dosageAmountPressable, { backgroundColor: bGTertiary }]}
            onPress={() => showDosageAmountInputRef.current?.open()}
          >
            <Text style={[styles.dosageAmountValue, { color: tintColor }]}>
              {dosageAmountState % 1 === 0 ? dosageAmountState : dosageAmountState.toFixed(1)}
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.bodyView}>
        <Text style={[styles.label, { color }]}>Форма лекарства</Text>
        <View
          style={styles.dosageUnitWrapper}
          onLayout={(event) => {
            setUnitWrapperWidth(event.nativeEvent.layout.width);
          }}
        >
          {DOSAGE_MEASUREMENT.map((unit) => {
            const isSelected = unit.value === dosageMeasurements.toUpperCase();
            return (
              <Pressable
                key={unit.value}
                style={[
                  styles.dosageUnitPressabale,
                  {
                    borderWidth: isSelected ? undefined : 1,
                    borderColor,
                    backgroundColor: isSelected ? tintColor : undefined,
                    width: UNIT_PRESSABLE_WIDTH,
                  },
                ]}
                onPress={() => handleSetDosageUnit(unit.value)}
              >
                <unit.icon size={30} color={isSelected ? "#F7F7F7" : color} />
                <Text style={[styles.dosageUnitLabel, { color: isSelected ? "#fff" : color }]}>
                  {unit.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* DOSAGE AMOUNT INPUT */}
      <DosageAmountInput
        measurementValue={dosageMeasurements}
        showInputRef={showDosageAmountInputRef}
        onSetValue={handleSetDosageAmount}
      />
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
    fontSize: 16,
    lineHeight: 19.2,
  },
  dosageAmountWrapper: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  dosageAmountPressable: {
    minWidth: 120,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  dosageAmountValue: {
    fontFamily: "Roboto_600SemiBold",
    fontSize: 24,
    lineHeight: 32,
    textAlign: "center",
  },
  dosageUnitWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: UNIT_WRAPPER_GAP,
  },
  dosageUnitPressabale: {
    height: 75,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    gap: 4,
  },
  dosageUnitLabel: {
    fontFamily: "Roboto_500Medium",
    fontSize: 12,
    lineHeight: 14.2,
    textAlign: "center",
  },
  dosageUnitIcon: {
    fontSize: 20,
    lineHeight: 24,
  },
});
