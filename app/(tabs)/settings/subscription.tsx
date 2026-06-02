import CheckCircleIcon from "@/component/icons/check-circle-icon";
import BottomSheetWrapper, { BottomSheetWrapperRef } from "@/component/ui/bottom-sheet-wrapper";
import CustomButton from "@/component/ui/custom-button/custom-button";
import Loader from "@/component/ui/loader";
import { useSubscriptionPlanQuery } from "@/hooks/use-subscription-plan-query";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useFeedBackStore } from "@/stores/feedback-store";
import { api } from "@/utils/axiosInstance";
import { getDateLocalString } from "@/utils/luxonUtil";
import { queryClient } from "@/utils/query-client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const formatDate = (isoDate: string | undefined) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  return getDateLocalString(date);
};

const cancelSubscriptionPlan = async () => {
  const response = await api.put<{ status: string }>("subscriptions");
  return response.data;
};

export default function Subscription() {
  const { showFeedBack } = useFeedBackStore();

  const bottomSheetRef = useRef<BottomSheetWrapperRef | null>(null);

  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { isPremiumPlan, endAt, billingCycle, subscriptionStatus } = useSubscriptionPlanQuery();

  const billingAmount = !billingCycle ? "" : billingCycle === "MONTHLY" ? "299,00" : "3050,00";
  const billingLabel = !billingCycle ? "" : billingCycle === "MONTHLY" ? "Месяц" : "Год";

  const activePaidSubscription = subscriptionStatus && subscriptionStatus === "ACTIVE";

  const currentPlanLabel = isPremiumPlan ? "Премиальный тариф" : "Базовый тариф";
  const pressableText = isPremiumPlan ? "Отменить план" : "Обновить план";

  const hideCancelButton = isPremiumPlan && !activePaidSubscription;

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

  const { isPending, mutate } = useMutation({
    mutationFn: cancelSubscriptionPlan,
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["subscriptions-plan"] });
      showFeedBack({
        title: "Подписка отменена!",
        message: "Вы отменили свою подписку.",
        status: "success",
      });
    },
    onError(error) {
      showFeedBack({
        title: "Что-то пошло не так!",
        message: "Пожалуйста, попробуйте еще раз!",
        status: "error",
      });
    },
  });

  // Themes
  const color = useThemeColor({}, "textPrimary");
  const mutedColor = useThemeColor({}, "textMuted");
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

          <Text style={[styles.cardLabel, { color }]}>{currentPlanLabel}</Text>

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

        {/* Subscription plan info */}
        {isPremiumPlan && activePaidSubscription && (
          <View
            style={[
              styles.cardInfo,
              { backgroundColor: bgSecondary, borderColor, flexDirection: "column" },
            ]}
          >
            <Text style={[styles.cardLabel, { color }]}>Платеж</Text>
            <Text style={[styles.cardInfoText, { color: mutedColor }]}>
              Ваш тарифный план будет автоматически продлен {formatDate(endAt)}. С вас будет
              взиматься плата в размере {billingAmount} рублей в {billingLabel}.
            </Text>
          </View>
        )}
      </View>

      <Loader visible={isPending} />

      {/* Cancel Plan Sheet */}
      <BottomSheetWrapper ref={bottomSheetRef} title="Отменить план?" snapPointPercent="30%">
        <View style={styles.cancelActionBox}>
          <Text style={[styles.cancelActionText, { color: mutedColor }]}>
            Вы потеряете доступ ко всем преимуществам этого тарифного плана после окончания текущего
            периода.
          </Text>
          <View style={styles.cancelActionBtnWrapper}>
            <CustomButton
              label="Отмена"
              variant="outline"
              textVaraint="mutedText"
              style={styles.cancelActionBtn}
              onPress={() => bottomSheetRef.current?.close()}
            />
            <CustomButton
              label="Отменить план"
              variant="danger"
              style={styles.cancelActionBtn}
              onPress={() => {
                mutate();
                bottomSheetRef.current?.close();
              }}
            />
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
    height: 24,
    paddingLeft: 12,
    paddingRight: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
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
