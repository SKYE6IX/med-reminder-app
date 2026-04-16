import { useThemeColor } from "@/hooks/use-theme-color";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { RefObject } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import PeopleGroupIcon from "../icons/people-group";
import { ThemedText } from "../themed-text/themed-text";
import BottomSheetWrapper, {
  BottomSheetWrapperRef,
} from "./bottom-sheet-wrapper";

type AddProfileProps = {
  ref: RefObject<BottomSheetWrapperRef | null>;
};

export default function AddProfile({ ref }: AddProfileProps) {
  // Themes color
  const textColor = useThemeColor({}, "textPrimary");
  const borderColor = useThemeColor({}, "borderColor");
  const bGColorTertiary = useThemeColor({}, "backgroundTertiary");
  const bGColorSecondary = useThemeColor({}, "backgroundSecondary");

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

        <View
          style={[
            styles.relationSelectionWrapper,
            { backgroundColor: bGColorSecondary },
          ]}
        >
          <PeopleGroupIcon color={textColor} />
          <Text style={[styles.relationSelectionLabel, { color: textColor }]}>
            Отношения
          </Text>
          <Pressable
            style={[
              styles.relationSelectionPressable,
              { backgroundColor: bGColorTertiary },
            ]}
          >
            <Text
              style={[
                styles.relationSelectionPressableText,
                { color: textColor },
              ]}
            >
              Выбрать
            </Text>
          </Pressable>
        </View>
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
  relationSelectionWrapper: {
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  relationSelectionLabel: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    lineHeight: 19.2,
  },
  relationSelectionPressable: {
    marginLeft: "auto",
    padding: 8,
    borderRadius: 12,
  },
  relationSelectionPressableText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    lineHeight: 16.2,
  },
});
