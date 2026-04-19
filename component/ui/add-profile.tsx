import { useThemeColor } from "@/hooks/use-theme-color";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { RefObject, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../themed-text/themed-text";
import BottomSheetWrapper, {
  BottomSheetWrapperRef,
} from "./bottom-sheet-wrapper";
import CustomButton from "./custom-button/custom-button";

type AddProfileProps = {
  ref: RefObject<BottomSheetWrapperRef | null>;
};

export default function AddProfile({ ref }: AddProfileProps) {
  const [selectedRelation, setSelectedRelation] = useState("");

  const textColor = useThemeColor({}, "textPrimary");
  const borderColor = useThemeColor({}, "borderColor");

  const handleOnRelationSelected = (relation: string) => {
    setSelectedRelation(relation);
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
        {/* 
        <CustomPicker
          label="Отношения"
          items={RELATION_LIST}
          svgIcon={<PeopleGroupIcon color={textColor} />}
          onValueSelected={handleOnRelationSelected}
        /> */}

        <CustomButton
          label="Добавить нового члена"
          variant="disabled"
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
    borderRadius: 12,
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    padding: 16,
    lineHeight: 19.2,
  },
  button: {
    marginTop: 20,
  },
});
