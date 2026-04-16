import PlusIcon from "@/component/icons/plus-icon";
import SearchIcon from "@/component/icons/search-icon";
import { useAddPillScreenStyles } from "@/component/shared-styles/add-pill-screen-styles";
import CustomButton from "@/component/ui/custom-button/custom-button";
import { useThemeColor } from "@/hooks/use-theme-color";
import { pillNames } from "@/mock-data";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function NameStepScreen() {
  const [query, setQuery] = useState("");

  const color = useThemeColor({}, "textPrimary");
  const inputBgColor = useThemeColor({}, "backgroundSecondary");
  const inputBorderColor = useThemeColor({}, "borderColor");
  const tint = useThemeColor({}, "tint");
  const router = useRouter();

  const sharedStyles = useAddPillScreenStyles();

  const results = pillNames.filter((pill) =>
    pill.toLowerCase().startsWith(query.toLowerCase()),
  );

  return (
    <View style={[styles.container, sharedStyles.container]}>
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
            value={query}
            onChangeText={(text) => setQuery(text)}
            style={[styles.input, { color }]}
            placeholder="Поиск"
            placeholderTextColor={color}
            onFocus={() => {}} // show suggestion when user start to type
            onBlur={() => {}} // hide when user are not type
            returnKeyType="search"
            keyboardType="default"
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      <View>
        <Pressable style={[styles.item, { borderColor: inputBorderColor }]}>
          <View style={[styles.iconWrapper, { backgroundColor: tint }]}>
            <PlusIcon />
          </View>
          <Text style={[styles.itemText, { color }]}>
            Добавить «{query}» как название
          </Text>
        </Pressable>

        {/* <FlatList
          data={results}
          renderItem={({ item }) => (
            <Pressable style={[styles.item, { borderColor: inputBorderColor }]}>
              <Text style={[styles.itemText, { color }]}>{item}</Text>
            </Pressable>
          )}
          keyExtractor={(item) => item}
        /> */}
      </View>

      <CustomButton
        label="Далее"
        style={sharedStyles.button}
        variant="disabled"
        textVaraint="mutedText"
        onPress={() => router.navigate("/(tabs)/add-pill/details-step")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  headerWrapper: {
    gap: 16,
    width: "100%",
  },
  inputWrapper: {
    width: "100%",
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 12,
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
  suggestionWrapper: {},
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
});
