import MedicationCard from "@/component/ui/medication-card/medication-card";
import { useThemeColor } from "@/hooks/use-theme-color";
import { mockMedications } from "@/mock-data";
import { formatRegularDate, getDateLocalString } from "@/utils/luxonUtil";
import { FlatList, StyleSheet, Text } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function RefillPill() {
  const insets = useSafeAreaInsets();

  // Themes
  const color = useThemeColor({}, "textPrimary");
  const bgPrimary = useThemeColor({}, "backgroundPrimary");

  const getStartedDate = (isoString: string) => {
    const date = new Date(isoString);
    const convertedString = getDateLocalString(date).replaceAll(".", " ");
    return formatRegularDate(convertedString);
  };

  const getSomeMock = () => {
    return mockMedications.splice(0, 5);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgPrimary }]} edges={["top"]}>
      <Text style={[styles.headerTitle, { color }]}>Пополнение лекарств</Text>
      <FlatList
        style={{ flex: 1 }}
        data={getSomeMock()}
        renderItem={({ item }) => (
          <MedicationCard
            imageUrl={item.medicationImageUrl}
            name={item.medicationName}
            startedDate={getStartedDate(item.schedule.startDate)}
            actionButtonLabel="Пополнить"
            onButtonPress={() => {}}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.listContentContainer, { paddingBottom: insets.bottom + 10 }]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: "Roboto_500Medium",
    fontSize: 20,
    lineHeight: 24,
    textAlign: "center",
  },
  listContentContainer: {
    paddingTop: 16,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 16,
    gap: 16,
  },
});
