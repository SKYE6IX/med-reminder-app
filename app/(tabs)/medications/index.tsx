import PlusIcon from "@/component/icons/plus-icon";
import MedicationListCard from "@/component/ui/cards/medication-list-card";
import CustomButton from "@/component/ui/custom-button/custom-button";
import Loader from "@/component/ui/loader";
import Tabs from "@/component/ui/tabs";
import { useMedicationProfileQuery } from "@/hooks/use-medication-profile-query";
import { useThemeColor } from "@/hooks/use-theme-color";
import useUpdateMedicationMutation from "@/hooks/use-update-medication-mutation";
import { useTranslation } from "@/i18next/i18next";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

type TABS_VALUE = "ALL" | "ACTIVE" | "IN_ACTIVE";

export default function Medications() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const isIOS = Platform.OS === "ios";

  const [activeTab, setActiveTab] = useState<TABS_VALUE>("ALL");
  const { isLoading, data } = useMedicationProfileQuery();

  // Updating mutation
  const { mutate, isPending } = useUpdateMedicationMutation({ name: "UPDATE ACTIVE STATUS" });

  const hasMedicationsProfiles = data && data.length >= 1 ? true : false;

  const getFilterMedicationsProfile = useMemo(() => {
    if (activeTab === "ALL") {
      return data;
    }
    return data?.filter((medProfile) => medProfile.status.toUpperCase() === activeTab);
  }, [activeTab, data]);

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

  const top = isIOS ? insets.top : insets.top + 20;
  const bottom = isIOS ? insets.bottom + 10 : 10;
  const TABS = [
    { label: t("medication_screen.tab_all"), value: "ALL" },
    { label: t("medication_screen.tab_active"), value: "ACTIVE" },
    { label: t("medication_screen.tab_inactive"), value: "IN_ACTIVE" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: top, backgroundColor: bgPrimary }} edges={["top"]}>
      <Loader visible={isLoading || isPending} />
      {!isLoading && (
        <>
          {hasMedicationsProfiles ? (
            <View style={styles.contentWrapper}>
              <View style={styles.tabWrapper}>
                <Tabs tabs={TABS} onTabChange={(tab) => handleOnTabChange(tab as TABS_VALUE)} />
              </View>
              {!isLoading && (
                <FlatList
                  style={{ flex: 1 }}
                  data={getFilterMedicationsProfile}
                  extraData={data}
                  renderItem={({ item }) => (
                    <MedicationListCard
                      key={item.id + item.status}
                      medicationProfile={item}
                      onSwitchToggle={handleOnSwitchToggle}
                    />
                  )}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={[styles.listContentContainer, { paddingBottom: bottom }]}
                />
              )}
            </View>
          ) : (
            <View style={[styles.noContentWrapper, { paddingBottom: bottom }]}>
              <Image
                source={require("@/assets/images/pill-bottle.png")}
                style={styles.noContentImage}
              />
              <Text style={[styles.noContentTitle, { color }]}>
                {t("medication_screen.no_content_heading")}
              </Text>
              <Text style={[styles.noContentSubtitle, { color: mutedColor }]}>
                {t("medication_screen.no_content_body")}
              </Text>
              <CustomButton
                label={t("common.add_medication")}
                svgIcon={<PlusIcon size={15} />}
                onPress={() => router.navigate("/(tabs)/add-medication")}
              />
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
