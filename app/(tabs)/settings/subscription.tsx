import CheckCircleIcon from "@/component/icons/check-circle-icon";
import { useSubscriptionPlanQuery } from "@/hooks/use-subscription-plan-query";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useTranslation } from "@/i18next/i18next";
import { useRouter } from "expo-router";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import Purchases from "react-native-purchases";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function Subscription() {
  const { t } = useTranslation();
  const isAndroid = Platform.OS === "android";

  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { isPremiumPlan, subscriptionStatus } = useSubscriptionPlanQuery();
  const activePaidSubscription = subscriptionStatus && subscriptionStatus === "ACTIVE";

  const currentPlanLabel = isPremiumPlan
    ? t("settings_screen.subscription_premimum_plan_label")
    : t("settings_screen.subscription_basic_plan_label");

  const pressableText = isPremiumPlan
    ? t("settings_screen.subscription_manage_plan")
    : t("settings_screen.subscription_upgrade_plan");

  const hideCancelButton = isPremiumPlan && !activePaidSubscription;

  const handleOnPress = async () => {
    // When is premium true, user will allow to cancel their
    // plan
    if (isPremiumPlan) {
      await Purchases.showManageSubscriptions();
    } else {
      // Else they will navigate to subscription page
      router.navigate("/(tabs)/settings/subscription-plan");
    }
  };

  // Themes
  const color = useThemeColor({}, "textPrimary");
  const bgPrimary = useThemeColor({}, "backgroundPrimary");
  const bgSecondary = useThemeColor({}, "backgroundSecondary");
  const borderColor = useThemeColor({}, "borderColor");
  const bgTertiary = useThemeColor({}, "backgroundTertiary");

  const top = isAndroid ? insets.top + 20 : insets.top + 10;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgPrimary, paddingTop: top }}>
      <View style={styles.container}>
        <View style={[styles.card, { backgroundColor: bgSecondary, borderColor }]}>
          <View style={[styles.cardCirlce, { backgroundColor: bgTertiary }]}>
            <CheckCircleIcon />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={[styles.cardLabel, { color }]}>{currentPlanLabel}</Text>
          </View>

          {!hideCancelButton && (
            <Pressable
              style={[
                styles.cardPressable,
                { backgroundColor: activePaidSubscription ? "#DC0000" : "#009E00" },
              ]}
              onPress={handleOnPress}
            >
              <Text style={styles.cardPressableText}>{pressableText}</Text>
            </Pressable>
          )}
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
    gap: 32,
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
  cardInfo: {
    minHeight: 65,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
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
    height: 28,
    paddingLeft: 12,
    paddingRight: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  cardPressableText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 12,
    lineHeight: 14.2,
    color: "#F7F7F7",
  },
  cardInfoText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
    lineHeight: 16.2,
  },
});
