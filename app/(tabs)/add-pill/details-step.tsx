import CapsuleIcon from "@/component/icons/capsule-icon";
import Ellipsis from "@/component/icons/ellipsis";
import EyeDropIcon from "@/component/icons/eye-drop-icon";
import InjectionIcon from "@/component/icons/injection-icon";
import PlusIcon from "@/component/icons/plus-icon";
import SprayIcon from "@/component/icons/spray-icon";
import SyrupBottleIcon from "@/component/icons/syrup-bottle-icon";
import TabletIcon from "@/component/icons/tablet-icon";
import { useAddPillScreenStyles } from "@/component/shared-styles/add-pill-screen-styles";
import AddProfile from "@/component/ui/add-profile";
import BottomSheetWrapper, {
  BottomSheetWrapperRef,
} from "@/component/ui/bottom-sheet-wrapper";
import CustomButton from "@/component/ui/custom-button/custom-button";
import ProfileCard from "@/component/ui/profile-card";
import { Relation } from "@/constants/relation";
import { useThemeColor } from "@/hooks/use-theme-color";
import { mockProfiles } from "@/mock-data";
import { useAddPillStore } from "@/stores/add-pill-store";
import { MedicationUnit } from "@/types/medication";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const medicationUnits = [
  { name: "Капсулы", icon: CapsuleIcon, value: MedicationUnit.CAPSULE },
  { name: "Таблетки", icon: TabletIcon, value: MedicationUnit.TABLET },
  { name: "Инъекции", icon: InjectionIcon, value: MedicationUnit.INJECTION },
  { name: "Спрей", icon: SprayIcon, value: MedicationUnit.SPRAY },
  { name: "Капли", icon: EyeDropIcon, value: MedicationUnit.DROPS },
  { name: "Сироп", icon: SyrupBottleIcon, value: MedicationUnit.SYRUP },
  { name: "Другое", icon: Ellipsis, value: MedicationUnit.OTHER },
];

export default function DetailsStepScreen() {
  const { setMedicationDetails, formState } = useAddPillStore();

  const router = useRouter();
  const sharedStyles = useAddPillScreenStyles();

  const newProfileBottomSheet = useRef<BottomSheetWrapperRef>(null);
  const chooseProfileBottomSheet = useRef<BottomSheetWrapperRef>(null);

  // Themes
  const color = useThemeColor({}, "textPrimary");
  const tintColor = useThemeColor({}, "tint");
  const bGColor = useThemeColor({}, "backgroundSecondary");
  const borderColor = useThemeColor({}, "borderColor");

  const selfProfile = mockProfiles.find((profile) => profile.isSelf);

  const relationProfile = mockProfiles.find(
    (profile) => profile.id === formState.profileId && !profile.isSelf,
  );

  const relationProfiles = mockProfiles.filter((profile) => !profile.isSelf);

  const isRelationProfileSelected = mockProfiles.some(
    (profile) => !profile.isSelf && profile.id === formState.profileId,
  );

  const handleSetProfile = (profileId: string) => {
    setMedicationDetails({ profileId });

    chooseProfileBottomSheet.current?.close();
  };

  return (
    <View style={[styles.container, sharedStyles.container]}>
      {/* Pill Form selections */}
      <View style={sharedStyles.sectionContainer}>
        <Text style={sharedStyles.title}>Выберите форму лекарства</Text>
        <View style={styles.pillFormWrapper}>
          {medicationUnits.map((unit, i) => (
            <View key={unit.value + i} style={styles.pillForm}>
              <Pressable
                style={[
                  styles.pillFormPressable,
                  {
                    borderWidth:
                      unit.value === formState.medicationUnit ? undefined : 1,
                    borderColor,
                    backgroundColor:
                      unit.value === formState.medicationUnit
                        ? tintColor
                        : bGColor,
                  },
                ]}
                onPress={() =>
                  setMedicationDetails({ medicationUnit: unit.value })
                }
              >
                <unit.icon
                  color={
                    unit.value === formState.medicationUnit ? "#F7F7F7" : color
                  }
                />
              </Pressable>
              <Text style={[styles.pillFormName, { color }]}>{unit.name}</Text>
            </View>
          ))}
          <View style={styles.ghostWrapper} />
        </View>
      </View>

      {/* Profile selection*/}
      <View style={sharedStyles.sectionContainer}>
        <Text style={sharedStyles.title}>Для кого это лекарство?</Text>
        <View style={styles.profilesWrapper}>
          {/* Self profile selection */}
          <ProfileCard
            isSelected={selfProfile?.id === formState.profileId}
            profileId={selfProfile?.id as string}
            isSelf
            hasActiveDot
            setProfile={handleSetProfile}
          />

          {/* Other profile selection */}
          {relationProfile && (
            <ProfileCard
              isSelected={relationProfile.id === formState.profileId}
              profileId={relationProfile.id}
              name={relationProfile.name}
              relation={relationProfile.relation as Relation}
              isSelf={false}
              hasActiveDot
              setProfile={handleSetProfile}
              changeProfile={() => chooseProfileBottomSheet.current?.open()}
            />
          )}

          {/* Trigger button to show bottom sheet for profile list */}
          {relationProfiles.length > 1 && !isRelationProfileSelected && (
            <CustomButton
              label="Выбрать члена семьи"
              variant="outline"
              textVaraint="tintText"
              svgIcon={<PlusIcon color={tintColor} size={12} />}
              onPress={() => chooseProfileBottomSheet.current?.open()}
            />
          )}

          {/* Bottom sheet for profile list */}
          <BottomSheetWrapper
            ref={chooseProfileBottomSheet}
            title="Выбрать члена семьи"
          >
            <View style={styles.profileSelectionList}>
              {relationProfiles.map((profile) => (
                <ProfileCard
                  isSelected={false} // it's part of list.// no active state on list
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
          </BottomSheetWrapper>

          {/* Trigger button for showing bottom sheet form for adding new profile */}
          <CustomButton
            label="Добавить члена семьи"
            variant="outline"
            textVaraint="tintText"
            svgIcon={<PlusIcon color={tintColor} size={12} />}
            onPress={() => newProfileBottomSheet.current?.open()}
          />
          {/* Bottom sheet adding new profile form  */}
          <AddProfile ref={newProfileBottomSheet} />
        </View>
      </View>

      <CustomButton
        label="Далее"
        style={sharedStyles.button}
        variant="disabled"
        textVaraint="mutedText"
        onPress={() => router.navigate("/(tabs)/add-pill/schedule-step")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 32,
  },
  pillFormWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },
  ghostWrapper: {
    width: 78,
    height: 105,
  },
  pillForm: {
    width: 78,
    height: 105,
    alignItems: "center",
    gap: 8,
  },
  pillFormPressable: {
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 78,
  },
  pillFormName: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    lineHeight: 19.2,
  },
  profilesWrapper: {
    gap: 8,
  },
  profileSelectionList: {
    gap: 8,
  },
});
