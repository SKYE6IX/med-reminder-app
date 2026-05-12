import PlusIcon from "@/component/icons/plus-icon";
import MedicationListCard from "@/component/ui/cards/medication-list-card";
import CustomButton from "@/component/ui/custom-button/custom-button";
import Loader from "@/component/ui/loader";
import Tabs from "@/component/ui/tabs";
import { useThemeColor } from "@/hooks/use-theme-color";
import useUpdateMedicationMutation from "@/hooks/use-update-medication-mutation";
import { MedicationProfile } from "@/types/medication";
import { api } from "@/utils/axiosInstance";
import { useFocusEffect } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { FlatList, Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

type TABS_VALUE = "ALL" | "ACTIVE" | "IN_ACTIVE";

const TABS = [
  { label: "Все", value: "ALL" },
  { label: "Активно", value: "ACTIVE" },
  { label: "Неактивно", value: "IN_ACTIVE" },
];

// Fetch query
const fetchMedicationProfiles = async () => {
  const response = await api.get<MedicationProfile[]>("medications");
  return response.data;
};

export default function Medications() {
  const isIOS = Platform.OS === "ios";
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const isMounted = useRef(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<TABS_VALUE>("ALL");

  // Query data list
  const { data, isLoading } = useQuery({
    queryKey: ["medication-profile", "list"],
    queryFn: fetchMedicationProfiles,
    staleTime: 60 * 60 * 1000,
  });

  // Updating mutation
  const { mutate, isPending } = useUpdateMedicationMutation();

  const hasMedicationsProfiles = data && data.length >= 1 ? true : false;

  const getFilterMedicationsProfile = useMemo(() => {
    if (activeTab === "ALL") {
      return data;
    }
    return data?.filter((medProfile) => medProfile.status.toUpperCase() === activeTab);
  }, [activeTab, data]);

  // We force a re-render for the UI so the List information
  // is up to date we the data.
  useFocusEffect(
    useCallback(() => {
      if (!isMounted.current) {
        isMounted.current = true;
        return;
      }
      setRefreshKey((prev) => prev + 1);
    }, []),
  );

  const handleOnTabChange = (tab: TABS_VALUE) => {
    setActiveTab(tab);
  };

  // Themes color
  const color = useThemeColor({}, "textPrimary");
  const mutedColor = useThemeColor({}, "textMuted");
  const bgPrimary = useThemeColor({}, "backgroundPrimary");

  // Update the medication profile status
  const handleOnSwitchToggle = (status: "active" | "inactive", id: string) => {
    if (status === "active") {
      mutate({ id, data: { isActive: true } });
    } else if (status === "inactive") {
      mutate({ id, data: { isActive: false } });
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgPrimary }]} edges={["top"]}>
      <Loader visible={isLoading || isPending} />
      {!isLoading && (
        <>
          {hasMedicationsProfiles ? (
            <View
              style={[styles.contentWrapper, { paddingTop: isIOS ? insets.top : insets.top + 10 }]}
            >
              <View style={styles.tabWrapper}>
                <Tabs tabs={TABS} onTabChange={(tab) => handleOnTabChange(tab as TABS_VALUE)} />
              </View>
              {!isLoading && (
                <FlatList
                  key={refreshKey}
                  style={{ flex: 1 }}
                  data={getFilterMedicationsProfile}
                  renderItem={({ item }) => (
                    <MedicationListCard
                      key={item.id}
                      medicationProfile={item}
                      onSwitchToggle={handleOnSwitchToggle}
                    />
                  )}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={[
                    styles.listContentContainer,
                    { paddingBottom: insets.bottom + 10 },
                  ]}
                />
              )}
            </View>
          ) : (
            <View style={[styles.noContentWrapper, { paddingBottom: insets.bottom + 10 }]}>
              <Image
                source={require("@/assets/images/pill-bottle.png")}
                style={styles.noContentImage}
              />
              <Text style={[styles.noContentTitle, { color }]}>У тебя нет никаких лекарств.</Text>
              <Text style={[styles.noContentSubtitle, { color: mutedColor }]}>
                Теперь добавьте новое лекарство.
              </Text>
              <CustomButton label="Добавить лекарства" svgIcon={<PlusIcon size={15} />} />
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: "Roboto_500Medium",
    fontSize: 20,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 16,
  },
  tabWrapper: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  listContentContainer: {
    paddingTop: 16,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 16,
    gap: 16,
  },
  noContentWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
    gap: 20,
  },
  noContentImage: {
    width: 160,
    height: 160,
  },
  noContentTitle: {
    width: 250,
    fontFamily: "Roboto_500Medium",
    fontSize: 20,
    lineHeight: 24,
    textAlign: "center",
  },
  noContentSubtitle: {
    width: 250,
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
    lineHeight: 16.2,
    textAlign: "center",
  },
});
