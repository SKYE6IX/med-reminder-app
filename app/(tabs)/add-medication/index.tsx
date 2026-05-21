import PlusIcon from "@/component/icons/plus-icon";
import SearchIcon from "@/component/icons/search-icon";
import { useAddPillScreenStyles } from "@/component/shared-styles/add-pill-screen-styles";
import CustomButton from "@/component/ui/custom-button/custom-button";
import { useThemeColor } from "@/hooks/use-theme-color";
import { pillNames } from "@/mock-data";
import { useAddPillStore } from "@/stores/add-pill-store";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NameStepScreen() {
  const sharedStyles = useAddPillScreenStyles();
  const { setMedicationDetails, formState } = useAddPillStore();

  const [hideSuggestionBox, setHideSuggestionBox] = useState(true);

  const medicationName = formState.medicationName;

  const isQueryFieldEmpty = medicationName.length < 1;

  // Themes
  const color = useThemeColor({}, "textPrimary");
  const inputBgColor = useThemeColor({}, "backgroundSecondary");
  const inputBorderColor = useThemeColor({}, "borderColor");
  const tint = useThemeColor({}, "tint");
  const router = useRouter();

  // Mock Data!
  const results = isQueryFieldEmpty
    ? []
    : pillNames.filter((pill) => pill.toLowerCase().startsWith(medicationName.toLocaleLowerCase()));

  const canContinue = useAddPillStore((s) => s.isFieldFilled(["medicationName"]));

  const handleSetPillName = (value: string) => {
    setMedicationDetails({
      medicationName: value,
    });
    setHideSuggestionBox(true);
  };

  const handleOnTextChange = (text: string) => {
    if (text.length < 1) {
      setMedicationDetails({
        medicationName: "",
      });
    } else {
      setMedicationDetails({
        medicationName: text,
      });
    }
    if (hideSuggestionBox) {
      setHideSuggestionBox(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, sharedStyles.container]} edges={["bottom"]}>
      <ScrollView>
        <View style={styles.headerWrapper}>
          <Text style={sharedStyles.title}>Название лекарства</Text>
          <View
            style={[
              styles.inputWrapper,
              { borderColor: inputBorderColor, backgroundColor: inputBgColor },
            ]}
          >
            <SearchIcon color={color} size={16} />
            <TextInput
              value={medicationName}
              onChangeText={handleOnTextChange}
              style={[styles.input, { color }]}
              placeholder="Поиск"
              placeholderTextColor={color}
              returnKeyType="search"
              keyboardType="default"
              autoCorrect={false}
              autoCapitalize="none"
              clearButtonMode="while-editing"
            />
          </View>
        </View>

        <View style={styles.suggestionWrapper}>
          {!isQueryFieldEmpty && !hideSuggestionBox && (
            <Pressable
              style={[styles.item, { borderColor: inputBorderColor }]}
              onPress={() => handleSetPillName(medicationName)}
            >
              <View style={[styles.iconWrapper, { backgroundColor: tint }]}>
                <PlusIcon />
              </View>
              <Text style={[styles.itemText, { color }]}>
                Добавить «{medicationName}» как название
              </Text>
            </Pressable>
          )}
          {!hideSuggestionBox &&
            results?.map((item) => (
              <Pressable
                key={item}
                style={[styles.item, { borderColor: inputBorderColor }]}
                onPress={() => handleSetPillName(item)}
              >
                <Text style={[styles.itemText, { color }]}>{item}</Text>
              </Pressable>
            ))}
        </View>
      </ScrollView>

      <CustomButton
        label="Далее"
        style={sharedStyles.button}
        variant={canContinue ? "filled" : "disabled"}
        textVaraint={canContinue ? "regularText" : "mutedText"}
        onPress={() => router.navigate("/(tabs)/add-medication/details-step")}
        disabled={!canContinue}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    paddingBottom: 10,
  },
  headerWrapper: {
    gap: 16,
    width: "100%",
  },
  inputWrapper: {
    width: "100%",
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 16,
    height: 48,
    paddingLeft: 16,
    paddingRight: 16,
    alignItems: "center",
    gap: 8,
    overflow: "hidden",
  },
  input: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    lineHeight: 17.8,
    height: "100%",
    width: "90%",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 8,
    paddingRight: 8,
    borderBottomWidth: 1,
  },
  iconWrapper: {
    width: 16,
    height: 16,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  itemText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
    lineHeight: 19.2,
  },
  suggestionWrapper: {
    width: "auto",
  },
});
