import CheckCircleIcon from "@/component/icons/check-circle-icon";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function Subscription() {
  const insets = useSafeAreaInsets();

  const router = useRouter();

  const color = useThemeColor({}, "textPrimary");
  const bgPrimary = useThemeColor({}, "backgroundPrimary");
  const bgSecondary = useThemeColor({}, "backgroundSecondary");
  const borderColor = useThemeColor({}, "borderColor");
  const bgTertiary = useThemeColor({}, "backgroundTertiary");

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgPrimary }]}>
      <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
        <View style={[styles.card, { backgroundColor: bgSecondary, borderColor }]}>
          <View style={[styles.cardCirlce, { backgroundColor: bgTertiary }]}>
            <CheckCircleIcon />
          </View>

          <Text style={[styles.cardLabel, { color }]}>Базовый тариф</Text>

          <Pressable
            style={[styles.cardPressable]}
            onPress={() => router.navigate("/(tabs)/settings/subscription-plan")}
          >
            <Text style={styles.cardPressableText}>Обновить план</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  card: {
    height: 65,
    borderWidth: 1,
    borderRadius: 16,
    paddingLeft: 16,
    paddingRight: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardCirlce: {
    width: 32,
    height: 32,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  cardLabel: {
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
    lineHeight: 19.2,
  },
  cardPressable: {
    marginLeft: "auto",
    height: 24,
    paddingLeft: 12,
    paddingRight: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#009E00",
  },
  cardPressableText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 12,
    lineHeight: 14.2,
    color: "#F7F7F7",
  },
});
