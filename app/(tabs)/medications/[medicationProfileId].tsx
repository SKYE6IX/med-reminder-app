import CalenderIcon from "@/component/icons/calender-icon";
import PillFilledIcon from "@/component/icons/pill-filled-icon";
import MedicationDetailCard from "@/component/ui/cards/medication-detail-card";
import Loader from "@/component/ui/loader";
import DeleteMedication from "@/component/ui/medication-details/delete-medication";
import DetailsDosageSettings from "@/component/ui/medication-details/dosage-settings";
import DetailsFrequencySettings from "@/component/ui/medication-details/frequency-settings";
import DetailsNoteSettings from "@/component/ui/medication-details/note-settings";
import StockDosageSettings from "@/component/ui/medication-details/stock-dosage-settings";
import DetailsTimeSettings from "@/component/ui/medication-details/time-settings";
import { getDosageMeasurement } from "@/helpers/getDosageMeasurement";
import { getStartedDate } from "@/helpers/getStartedDate";
import { useThemeColor } from "@/hooks/use-theme-color";
import useUpdateMedicationMutation from "@/hooks/use-update-medication-mutation";
import { MedicationProfile } from "@/types/medication";
import { api } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

// Medication profile details query
const fetchMedicationProfileDetails = async (id: string) => {
  const response = await api.get<MedicationProfile>(`medications/${id}`);
  return response.data;
};

export default function MedicationDetails() {
  const isIOS = Platform.OS === "ios";
  const insets = useSafeAreaInsets();
  const { medicationProfileId } = useLocalSearchParams();

  // Query details data
  const { data: medicationProfile, isLoading } = useQuery({
    queryKey: ["medication-profile", "details", medicationProfileId],
    queryFn: () => fetchMedicationProfileDetails(medicationProfileId as string),
    staleTime: 60 * 60 * 1000,
  });

  // Updating mutation
  const { mutate, isPending } = useUpdateMedicationMutation();

  // Update the medication profile status
  const handleOnSwitchToggle = (status: "active" | "inactive", id: string) => {
    if (status === "active") {
      mutate({ id, data: { isActive: true } });
    } else if (status === "inactive") {
      mutate({ id, data: { isActive: false } });
    }
  };

  // Themes color
  const color = useThemeColor({}, "textPrimary");
  const mutedColor = useThemeColor({}, "textMuted");
  const bgPrimary = useThemeColor({}, "backgroundPrimary");
  const bgSecondary = useThemeColor({}, "backgroundSecondary");

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgPrimary }]} edges={["top"]}>
      <ScrollView
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: isIOS ? undefined : insets.top + 10, paddingBottom: 10 },
        ]}
      >
        <Loader visible={isLoading || isPending} />
        {medicationProfile && (
          <View style={styles.contentContainer}>
            <MedicationDetailCard
              medicationProfile={medicationProfile}
              onSwitchToggle={handleOnSwitchToggle}
            />

            {/* Details Wrapper */}
            <View style={styles.detailsContainer}>
              {/* Schedule Information Wrapper */}
              <View style={styles.detailsWrapper}>
                <Text style={[styles.detailsTitle, { color }]}>Расписание</Text>

                {/* GROUP */}
                <View style={styles.detailsGroup}>
                  {/* DATE STARTED */}
                  <View
                    style={[styles.card, styles.detailsGroupItem, { backgroundColor: bgSecondary }]}
                  >
                    <View style={styles.cardHeader}>
                      <Text style={[styles.cardTitle, { color }]}>Дата начала</Text>
                    </View>
                    <View style={styles.cardBody}>
                      <CalenderIcon color={color} />
                      <Text style={[styles.cardTextContent, { color }]}>
                        {getStartedDate(medicationProfile.schedule.startDate)}
                      </Text>
                    </View>
                  </View>

                  {/* TIME STARTED */}
                  <DetailsTimeSettings medicationProfile={medicationProfile} />
                </View>

                {/* FREQUENCY RRULE */}
                <DetailsFrequencySettings medicationProfile={medicationProfile} />
              </View>

              {/* MEDICATION REASON */}
              {medicationProfile.medicationReason && (
                <View style={styles.detailsWrapper}>
                  <Text style={[styles.detailsTitle, { color }]}>Причина приема лекарства</Text>
                  <View style={[styles.dosageTakenInfo, { backgroundColor: bgSecondary }]}>
                    <PillFilledIcon color={color} />
                    <Text style={[styles.cardTextContent, { color: mutedColor }]}>
                      {medicationProfile.medicationReason}
                    </Text>
                  </View>
                </View>
              )}

              {/* Dosage Information */}
              <View style={styles.detailsWrapper}>
                <Text style={[styles.detailsTitle, { color }]}>Дозировка</Text>

                <View style={styles.detailsGroup}>
                  {/* DOSAGE AMOUNT */}
                  <DetailsDosageSettings medicationProfile={medicationProfile} />

                  {/* STOCK DOSAGE AMOUNT */}
                  <StockDosageSettings medicationProfile={medicationProfile} />
                </View>

                {/* NOTE ABOUT DOSAGE USAGE */}
                <DetailsNoteSettings medicationProfile={medicationProfile} />

                {/* TOTAL DOSAGE TAKEN INFO */}
                <View style={[styles.dosageTakenInfo, { backgroundColor: bgSecondary }]}>
                  <PillFilledIcon color={color} />
                  <Text style={[styles.cardTextContent, { color: mutedColor }]}>
                    {medicationProfile && Number(medicationProfile.schedule.amountTaken) >= 1
                      ? `${medicationProfile.schedule.amountTaken} ${getDosageMeasurement(medicationProfile.schedule.measurement)} принято`
                      : "Лекарство еще не было принято"}
                  </Text>
                </View>
              </View>
            </View>

            {/* DELETE PILL BUTTON */}
            <DeleteMedication medicationProfileId={medicationProfileId as string} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingLeft: 20,
    paddingRight: 20,
    gap: 32,
  },
  headerTitle: {
    fontFamily: "Roboto_500Medium",
    fontSize: 20,
    lineHeight: 24,
    textAlign: "center",
    maxWidth: 300,
    alignSelf: "center",
  },
  contentContainer: {
    flex: 1,
    gap: 16,
  },
  detailsContainer: {
    gap: 16,
  },
  detailsWrapper: {
    gap: 16,
  },
  detailsGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailsGroupItem: {
    width: "48%",
  },
  detailsTitle: {
    fontFamily: "Roboto_500Medium",
    fontSize: 18,
    lineHeight: 21.2,
  },
  card: {
    padding: 12,
    borderRadius: 16,
    minHeight: 76,
    gap: 8,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardBody: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardTitle: {
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
    lineHeight: 19.2,
  },
  cardTextContent: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    lineHeight: 16.2,
  },
  dosageTakenInfo: {
    padding: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
