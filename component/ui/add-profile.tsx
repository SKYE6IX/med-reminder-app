import { RELATION_LIST } from "@/constants/relation";
import { useThemeColor } from "@/hooks/use-theme-color";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { RefObject, useState } from "react";
import { StyleSheet, View } from "react-native";
import PeopleGroupIcon from "../icons/people-group";
import { ThemedText } from "../themed-text/themed-text";
import BottomSheetWrapper, {
  BottomSheetWrapperRef,
} from "./bottom-sheet-wrapper";
import CustomButton from "./custom-button/custom-button";
import CustomPicker from "./custom-picker/custom-picker";

type AddProfileProps = {
  ref: RefObject<BottomSheetWrapperRef | null>;
};

export default function AddProfile({ ref }: AddProfileProps) {
  const [selectedRelation, setSelectedRelation] = useState("");

  // @platform IOS ONLY
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const textColor = useThemeColor({}, "textPrimary");
  const borderColor = useThemeColor({}, "borderColor");

  const handleOnRelationSelected = (relation: string) => {
    setSelectedRelation(relation);
  };

  // @platform IOS ONLY
  const triggerSelectionPicker = () => {
    setIsPickerVisible(!isPickerVisible);
  };

  return (
    <BottomSheetWrapper ref={ref} title="Добавить члена семьи">
      <View style={styles.profileFormContainer}>
        <View style={styles.profileFormInputWrapper}>
          <ThemedText type="label">Имя</ThemedText>
          <BottomSheetTextInput
            style={[styles.profileFormInput, { borderColor }]}
            autoCorrect={false}
            autoCapitalize="sentences"
            keyboardType="default"
            placeholder="Введите имя"
            placeholderTextColor="#9E9E9E"
          />
        </View>

        <CustomPicker
          label="Отношения"
          selectedValue=""
          items={RELATION_LIST}
          svgIcon={<PeopleGroupIcon color={textColor} />}
          onValueSelected={handleOnRelationSelected}
          isSelectionVisible={isPickerVisible}
          triggerSelection={triggerSelectionPicker}
        />

        <CustomButton
          label="Добавить нового члена"
          variant="disabled"
          textVaraint="mutedText"
          style={styles.button}
        />
      </View>
    </BottomSheetWrapper>
  );
}

const styles = StyleSheet.create({
  profileFormContainer: {
    gap: 16,
  },
  profileFormInputWrapper: {
    gap: 8,
  },
  profileFormInput: {
    borderWidth: 1,
    borderRadius: 16,
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    padding: 16,
    lineHeight: 19.2,
  },
  button: {
    marginTop: 20,
  },
});
