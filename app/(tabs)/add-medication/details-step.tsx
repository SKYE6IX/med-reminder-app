import { useBottomSheet } from "@/component/bottom-sheet-provider";
import PlusIcon from "@/component/icons/plus-icon";
import { useAddPillScreenStyles } from "@/component/shared-styles/add-pill-screen-styles";
import AddProfile from "@/component/ui/add-profile";
import CustomButton from "@/component/ui/custom-button/custom-button";
import FormInput from "@/component/ui/form/form-input";
import ProfileCard from "@/component/ui/profile-card";
import SubscriptionBanner, { SubscriptionBannerRef } from "@/component/ui/subscription-banner";
import { MEDICATION_UNITS } from "@/constants/medication-constants";
import { Relation } from "@/constants/relation";
import { useProfilesQuery } from "@/hooks/use-profiles-query";
import { useSubscriptionPlanQuery } from "@/hooks/use-subscription-plan-query";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAddPillStore } from "@/stores/add-pill-store";
import { ProfileResponse } from "@/types/user";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const UNIT_PRESSABLE_PER_ROW = 4;
const UNIT_WRAPPER_GAP = 16;

export default function DetailsStepScreen() {
  const insets = useSafeAreaInsets();
  const openBannerRef = useRef<SubscriptionBannerRef>(null);

  const { openSheet, closeSheet } = useBottomSheet();

  const [unitWrapperWidth, setUnitWrapperWidth] = useState(0);

  const UNIT_PRESSABLE_WIDTH = (unitWrapperWidth - UNIT_WRAPPER_GAP * 2) / UNIT_PRESSABLE_PER_ROW;

  const { setMedicationDetails, formState } = useAddPillStore();
  const { selfProfile, relationProfiles } = useProfilesQuery();
  const { isPremiumPlan } = useSubscriptionPlanQuery();

  const router = useRouter();
  const sharedStyles = useAddPillScreenStyles();

  // Themes
  const color = useThemeColor({}, "textPrimary");
  const tintColor = useThemeColor({}, "tint");
  const bGColor = useThemeColor({}, "backgroundSecondary");
  const backgroundColor = useThemeColor({}, "backgroundPrimary");
  const borderColor = useThemeColor({}, "borderColor");

  const selectedRelationProfile = relationProfiles.find(
    (profile) => profile.id === formState.profileId,
  );

  const isRelationProfileSelected = selectedRelationProfile?.id === formState.profileId;

  const handleSetProfile = (profileId: string) => {
    setMedicationDetails({ profileId });
    closeSheet();
  };

  const canContinue = useAddPillStore((s) => s.isFieldFilled(["medicationUnit", "profileId"]));

  const handleOnTextInputChange = ({ value }: { name: string; value: string }) => {
    if (value.length <= 0) {
      setMedicationDetails({ medicationReason: null });
    } else {
      setMedicationDetails({ medicationReason: value });
    }
  };

  const openAddNewProfileSheet = () => {
    if (isPremiumPlan) {
      openSheet({
        title: "Добавить члена семьи",
        content: (
          <AddProfile
            onProfileAdded={(id) => {
              setMedicationDetails({ profileId: id });
              closeSheet();
            }}
          />
        ),
      });
    } else {
      openBannerRef.current?.openModal();
    }
  };

  const openRelationProfileListSheet = () => {
    if (isPremiumPlan) {
      openSheet({
        title: "Выбрать члена семьи",
        content: (
          <RelationProfileListSheet
            relationProfiles={relationProfiles}
            handleSetProfile={handleSetProfile}
          />
        ),
      });
    } else {
      openBannerRef.current?.openModal();
    }
  };

  const top = Platform.OS === "android" ? insets.top + 10 : 0;

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: top, backgroundColor }} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {/* Pill Form selections */}
        <View style={sharedStyles.sectionContainer}>
          <Text style={sharedStyles.title}>Выберите форму лекарства</Text>
          <View
            style={[styles.pillFormWrapper]}
            onLayout={(event) => {
              setUnitWrapperWidth(event.nativeEvent.layout.width);
            }}
          >
            {MEDICATION_UNITS.map((unit, i) => (
              <View key={unit.value + i} style={[styles.pillForm, { width: UNIT_PRESSABLE_WIDTH }]}>
                <Pressable
                  style={[
                    styles.pillFormPressable,
                    {
                      borderWidth: unit.value === formState.medicationUnit ? 0 : 1,
                      borderColor,
                      backgroundColor:
                        unit.value === formState.medicationUnit ? tintColor : bGColor,
                    },
                  ]}
                  onPress={() => setMedicationDetails({ medicationUnit: unit.value })}
                >
                  <unit.icon color={unit.value === formState.medicationUnit ? "#F7F7F7" : color} />
                </Pressable>
                <Text style={[styles.pillFormName, { color }]}>{unit.name}</Text>
              </View>
            ))}
            <View style={[styles.ghostWrapper, { width: UNIT_PRESSABLE_WIDTH }]} />
          </View>
        </View>

        {/* MEDICATION REASON */}
        <View style={sharedStyles.sectionContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={sharedStyles.title}>Причина</Text>
            <Text style={[styles.optionalText, { color }]}>«Необязательно»</Text>
          </View>
          <FormInput
            showLabel={false}
            type="text"
            hasError={false}
            name="medicationReason"
            onValueChange={handleOnTextInputChange}
          />
        </View>

        {/* Profile selection*/}
        <View style={sharedStyles.sectionContainer}>
          <Text style={sharedStyles.title}>Для кого это лекарство?</Text>
          <View style={styles.profilesWrapper}>
            {/* SELF PROFILE*/}
            <ProfileCard
              profileId={selfProfile?.id as string}
              isSelected={selfProfile?.id === formState.profileId}
              isSelf
              hasActiveDot
              setProfile={handleSetProfile}
            />

            {/* RELATION PROFILE */}
            {selectedRelationProfile && (
              <ProfileCard
                isSelected={isRelationProfileSelected}
                profileId={selectedRelationProfile.id}
                name={selectedRelationProfile.name}
                relation={selectedRelationProfile.relation as Relation}
                isSelf={false}
                hasActiveDot
                setProfile={handleSetProfile}
                changeProfile={openRelationProfileListSheet}
              />
            )}

            {/* TRIGGER BUTTON FOR RELATION PROFILE LIST */}
            {relationProfiles.length >= 1 && !isRelationProfileSelected && (
              <CustomButton
                label="Выбрать члена семьи"
                variant="outline"
                textVaraint="tintText"
                svgIcon={<PlusIcon color={tintColor} size={12} />}
                onPress={openRelationProfileListSheet}
              />
            )}

            {/* TRIGGER BUTTON FOR ADDING NEW RELATION PROFILE */}
            <CustomButton
              label="Добавить члена семьи"
              variant="outline"
              textVaraint="tintText"
              svgIcon={<PlusIcon color={tintColor} size={12} />}
              onPress={openAddNewProfileSheet}
            />
          </View>
        </View>

        {/* CONTINUE BUTTON */}
        <CustomButton
          label="Далее"
          style={sharedStyles.button}
          variant={canContinue ? "filled" : "disabled"}
          textVaraint={canContinue ? "regularText" : "mutedText"}
          onPress={() => router.navigate("/(tabs)/add-medication/schedule-step")}
          disabled={!canContinue}
        />

        {/* SUBSCRIPTION OFFER */}
        <SubscriptionBanner ref={openBannerRef} />
      </ScrollView>
    </SafeAreaView>
  );
}

const RelationProfileListSheet = ({
  relationProfiles,
  handleSetProfile,
}: {
  relationProfiles: ProfileResponse[];
  handleSetProfile: (profileId: string) => void;
}) => {
  return (
    <View style={styles.profileSelectionList}>
      {relationProfiles.map((profile) => (
        <ProfileCard
          isSelected={false} // They are list. No active state on list
          profileId={profile.id}
          key={profile.id}
          name={profile.name}
          relation={profile.relation as Relation}
          isSelf={false}
          hasActiveDot={false}
          asList
          setProfile={handleSetProfile}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    gap: 32,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
  },
  pillFormWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: UNIT_WRAPPER_GAP / 2,
  },
  ghostWrapper: {
    height: "auto",
    aspectRatio: 1 / 1,
  },

  pillForm: {
    height: "auto",
    aspectRatio: 1 / 1.3,
    alignItems: "center",
    justifyContent: "space-between",
  },

  pillFormPressable: {
    height: "74%",
    width: "100%",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  pillFormName: {
    height: "24%",
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    lineHeight: 19.2,
  },
  profilesWrapper: {
    gap: 16,
  },
  profileSelectionList: {
    gap: 8,
  },
  optionalText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    lineHeight: 16.2,
  },
});
