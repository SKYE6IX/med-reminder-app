import CheckCircleIcon from "@/component/icons/check-circle-icon";
import BottomSheetWrapper, { BottomSheetWrapperRef } from "@/component/ui/bottom-sheet-wrapper";
import CustomButton from "@/component/ui/custom-button/custom-button";
import { useSubscriptionPlanQuery } from "@/hooks/use-subscription-plan-query";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function Subscription() {
  const bottomSheetRef = useRef<BottomSheetWrapperRef | null>(null);

  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { isPremiumPlan } = useSubscriptionPlanQuery();

  // Themes
  const color = useThemeColor({}, "textPrimary");
  const mutedColor = useThemeColor({}, "textMuted");
  const bgPrimary = useThemeColor({}, "backgroundPrimary");
  const bgSecondary = useThemeColor({}, "backgroundSecondary");
  const borderColor = useThemeColor({}, "borderColor");
  const bgTertiary = useThemeColor({}, "backgroundTertiary");

  const label = isPremiumPlan ? "Премиальный тариф" : "Базовый тариф";
  const pressableText = isPremiumPlan ? "Отменить план" : "Обновить план";

  const handleOnPress = () => {
    // When is premium true, user will allow to cancel their
    // plan
    if (isPremiumPlan) {
      bottomSheetRef.current?.open();
    } else {
      // Else they will navigate to subscription page
      router.navigate("/(tabs)/settings/subscription-plan");
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgPrimary }]}>
      <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
        <View style={[styles.card, { backgroundColor: bgSecondary, borderColor }]}>
          <View style={[styles.cardCirlce, { backgroundColor: bgTertiary }]}>
            <CheckCircleIcon />
          </View>

          <Text style={[styles.cardLabel, { color }]}>{label}</Text>

          <Pressable style={[styles.cardPressable]} onPress={handleOnPress}>
            <Text style={styles.cardPressableText}>{pressableText}</Text>
          </Pressable>
        </View>
      </View>

      {/* Cancel Plan Sheet */}
      <BottomSheetWrapper ref={bottomSheetRef} title="Отменить план?" snapPointPercent="30%">
        <View style={styles.cancelActionBox}>
          <Text style={[styles.cancelActionText, { color: mutedColor }]}>
            Вы потеряете доступ ко всем преимуществам этого плана.
          </Text>
          <View style={styles.cancelActionBtnWrapper}>
            <CustomButton
              label="Отмена"
              variant="outline"
              textVaraint="mutedText"
              style={styles.cancelActionBtn}
              onPress={() => bottomSheetRef.current?.close()}
            />
            <CustomButton label="Отменить план" variant="danger" style={styles.cancelActionBtn} />
          </View>
        </View>
      </BottomSheetWrapper>
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

  cancelActionBox: {
    gap: 16,
    alignItems: "center",
  },
  cancelActionText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    lineHeight: 19.2,
    width: 360,
    textAlign: "center",
  },
  cancelActionBtnWrapper: {
    flexDirection: "row",
    gap: 16,
  },
  cancelActionBtn: {
    width: "47%",
  },
});
