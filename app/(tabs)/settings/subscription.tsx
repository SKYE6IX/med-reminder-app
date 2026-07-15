import { useBottomSheet } from "@/component/bottom-sheet-provider";
import CheckCircleIcon from "@/component/icons/check-circle-icon";
import CustomButton from "@/component/ui/custom-button/custom-button";
import Loader from "@/component/ui/loader";
import { QueryKey } from "@/constants/query-keys";
import { useSubscriptionPlanQuery } from "@/hooks/use-subscription-plan-query";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useFeedBackStore } from "@/stores/feedback-store";
import { api, axios } from "@/utils/axiosInstance";
import { getDateLocalString } from "@/utils/luxonUtil";
import { queryClient } from "@/utils/query-client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
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
  const isAndroid = Platform.OS === "android";

  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { showFeedBack } = useFeedBackStore();
  const { openSheet, closeSheet } = useBottomSheet();

  const { isPremiumPlan, endAt, billingCycle, subscriptionStatus } = useSubscriptionPlanQuery();

  const billingAmount = !billingCycle ? "" : billingCycle === "MONTHLY" ? "299,00" : "3050,00";
  const billingLabel = !billingCycle ? "" : billingCycle === "MONTHLY" ? "Месяц" : "Год";

  const activePaidSubscription = subscriptionStatus && subscriptionStatus === "ACTIVE";

  const currentPlanLabel = isPremiumPlan ? "Премиум тариф" : "Базовый тариф";
  const pressableText = isPremiumPlan ? "Отменить план" : "Обновить план";

  const hideCancelButton = isPremiumPlan && !activePaidSubscription;

  const { isPending, mutate } = useMutation({
    mutationFn: cancelSubscriptionPlan,
    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: [QueryKey.subscriptionPlan] });
      showFeedBack({
        title: "Подписка отменена!",
        message: "Вы отменили свою подписку.",
        status: "success",
      });
      closeSheet();
    },

    onError(error) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ERR_NETWORK") {
          showFeedBack({
            title: "Ошибка сети!",
            message: "Проверьте подключение к интернету.",
            status: "error",
          });
        } else {
          showFeedBack({
            title: "Что-то пошло не так!",
            message: "Пожалуйста, попробуйте еще раз!",
            status: "error",
          });
        }
      }
    },
  });

  const snapPoint = isAndroid ? "35%" : "30%";
  const handleOnPress = () => {
    // When is premium true, user will allow to cancel their
    // plan
    if (isPremiumPlan) {
      openSheet({
        title: "Отменить план?",
        snapPointPercent: snapPoint,
        content: <CancelSubscriptionSheet cancelAction={mutate} closeSheet={closeSheet} />,
      });
    } else {
      // Else they will navigate to subscription page
      router.navigate("/(tabs)/settings/subscription-plan");
    }
  };

  // Themes
  const color = useThemeColor({}, "textPrimary");
  const mutedColor = useThemeColor({}, "textMuted");
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
    </SafeAreaView>
  );
}

const CancelSubscriptionSheet = ({
  cancelAction,
  closeSheet,
}: {
  cancelAction: () => void;
  closeSheet: () => void;
}) => {
  const mutedColor = useThemeColor({}, "textMuted");
  return (
    <View style={styles.cancelActionBox}>
      <Text style={[styles.cancelActionText, { color: mutedColor }]}>
        Вы потеряете доступ ко всем преимуществам этого тарифного плана после окончания текущего
        периода.
      </Text>
      <View style={styles.cancelActionBtnWrapper}>
        <CustomButton
          label="Отмена"
          variant="outline"
          textVaraint="tintText"
          style={styles.cancelActionBtn}
          onPress={closeSheet}
        />
        <CustomButton
          label="Отменить план"
          variant="danger"
          style={styles.cancelActionBtn}
          onPress={cancelAction}
        />
      </View>
    </View>
  );
};

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
