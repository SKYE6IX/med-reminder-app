import { useBottomSheet } from "@/component/bottom-sheet-provider";
import ArrowRight from "@/component/icons/arrow-right";
import NoteIcon from "@/component/icons/note-icon";
import { useThemeColor } from "@/hooks/use-theme-color";
import useUpdateMedicationMutation from "@/hooks/use-update-medication-mutation";
import { MedicationProfile } from "@/types/medication";
import { BottomSheetScrollView, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import React, { useMemo, useState } from "react";
import { Keyboard, Pressable, StyleSheet, Text, View } from "react-native";
import CustomButton from "../custom-button/custom-button";
import Loader from "../loader";
import { useSharedStyles } from "./use-shared-styles";

export default function DetailsNoteSettings({
  medicationProfile,
}: {
  medicationProfile: MedicationProfile;
}) {
  const { openSheet, closeSheet } = useBottomSheet();

  // Themes
  const sharedStyles = useSharedStyles();
  const color = useThemeColor({}, "textPrimary");
  const mutedColor = useThemeColor({}, "textMuted");

  const openUpdateNoteSheet = () => {
    openSheet({
      title: "Изменить заметку",
      content: <UpdateNoteSheet medicationProfile={medicationProfile} closeSheet={closeSheet} />,
    });
  };

  return (
    <React.Fragment>
      <Pressable style={sharedStyles.card} onPress={openUpdateNoteSheet}>
        <View style={sharedStyles.cardHeader}>
          <Text style={sharedStyles.cardTitle}>Заметка</Text>
          <ArrowRight color={color} />
        </View>

        <View style={[sharedStyles.cardBody, { alignItems: "flex-start" }]}>
          <NoteIcon color={color} />
          <View style={{ flex: 1 }}>
            <Text style={[sharedStyles.cardTextContent, { color: mutedColor }]}>
              {medicationProfile.note ? medicationProfile.note : "Добавьте заметку..."}
            </Text>
          </View>
        </View>
      </Pressable>
    </React.Fragment>
  );
}

const UpdateNoteSheet = ({
  medicationProfile,
  closeSheet,
}: {
  medicationProfile: MedicationProfile;
  closeSheet: () => void;
}) => {
  const { isPending, mutate } = useUpdateMedicationMutation({
    name: "UPDATE NOTE",
    onSucceed() {
      closeSheet();
    },
  });

  const [updatedNote, setUpdateNote] = useState("");

  const existingNote = medicationProfile.note ? medicationProfile.note : "";

  const canUpdate = useMemo(
    () => medicationProfile.note !== updatedNote,
    [medicationProfile.note, updatedNote],
  );

  const handleUpdateNote = () => {
    const note = updatedNote.length > 1 ? updatedNote : "";
    mutate({ id: medicationProfile.id, data: { note } });
    Keyboard.dismiss();
  };

  const color = useThemeColor({}, "textPrimary");
  const bGColor = useThemeColor({}, "backgroundSecondary");
  const borderColor = useThemeColor({}, "borderColor");

  return (
    <BottomSheetScrollView contentContainerStyle={{ gap: 32, height: 500 }}>
      <BottomSheetTextInput
        value={updatedNote.length ? updatedNote : existingNote}
        onChangeText={(value) => setUpdateNote(value)}
        autoCorrect={true}
        multiline={true}
        numberOfLines={5}
        textAlignVertical="top"
        scrollEnabled={true}
        returnKeyType="default"
        keyboardType="default"
        placeholder="Заметка о лекарстве"
        placeholderTextColor="#9E9E9E"
        maxLength={500}
        style={[styles.textAreaInput, { borderColor, backgroundColor: bGColor, color }]}
      />

      <CustomButton
        label="Применить"
        onPress={handleUpdateNote}
        disabled={!canUpdate}
        variant={canUpdate ? "filled" : "disabled"}
        textVaraint={canUpdate ? "regularText" : "mutedText"}
      />

      <Loader visible={isPending} />
    </BottomSheetScrollView>
  );
};

const styles = StyleSheet.create({
  textAreaInput: {
    borderWidth: 1,
    borderRadius: 16,
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    padding: 16,
    lineHeight: 16.8,
    minHeight: 100,
    maxHeight: 200,
  },
});
