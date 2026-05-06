import ArrowRight from "@/component/icons/arrow-right";
import NoteIcon from "@/component/icons/note-icon";
import { useThemeColor } from "@/hooks/use-theme-color";
import useUpdateMedicationMutation from "@/hooks/use-update-medication-mutation";
import { MedicationProfileResponse } from "@/types/medication";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import React, { useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import BottomSheetWrapper, { BottomSheetWrapperRef } from "../bottom-sheet-wrapper";
import CustomButton from "../custom-button/custom-button";
import Loader from "../loader";
import { useSharedStyles } from "./use-shared-styles";

export default function DetailsNoteSettings({
  medicationProfile,
}: {
  medicationProfile: MedicationProfileResponse;
}) {
  const { isPending, mutate } = useUpdateMedicationMutation();
  const bottomSheetRef = useRef<BottomSheetWrapperRef>(null);

  const [updatedNote, setUpdateNote] = useState("");

  const canUpdate = useMemo(
    () => medicationProfile.note !== updatedNote,
    [medicationProfile.note, updatedNote],
  );

  // Themes
  const sharedStyles = useSharedStyles();
  const color = useThemeColor({}, "textPrimary");
  const mutedColor = useThemeColor({}, "textMuted");
  const bGColor = useThemeColor({}, "backgroundSecondary");
  const borderColor = useThemeColor({}, "borderColor");

  const handleUpdateNote = () => {
    mutate({ id: medicationProfile.id, data: { note: updatedNote } });
    bottomSheetRef.current?.close();
  };

  return (
    <React.Fragment>
      <Pressable style={sharedStyles.card} onPress={() => bottomSheetRef.current?.open()}>
        <View style={sharedStyles.cardHeader}>
          <Text style={sharedStyles.cardTitle}>Заметки</Text>
          <ArrowRight color={color} />
        </View>
        <View style={sharedStyles.cardBody}>
          <NoteIcon color={color} />
          <Text style={[sharedStyles.cardTextContent, { color: mutedColor }]}>
            {medicationProfile.note ? medicationProfile.note : "Добавьте заметку..."}
          </Text>
        </View>

        <BottomSheetWrapper ref={bottomSheetRef} title="Изменить заметку">
          <View style={{ gap: 16 }}>
            <BottomSheetTextInput
              value={updatedNote}
              onChangeText={(value) => setUpdateNote(value)}
              autoCorrect={true}
              multiline={true}
              numberOfLines={4}
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
          </View>
        </BottomSheetWrapper>
      </Pressable>

      <Loader visible={isPending} />
    </React.Fragment>
  );
}

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
