import CheckCircleIcon from "@/component/icons/check-circle-icon";
import CheckIcon from "@/component/icons/check-icon";
import StarIcon from "@/component/icons/star-icon";
import CustomButton from "@/component/ui/custom-button/custom-button";
import SettingsCard from "@/component/ui/settings/settings-card";
import { QueryKey } from "@/constants/query-keys";
import { ENTITLEMENT_KEY } from "@/constants/susbscription-key";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useTranslation } from "@/i18next/i18next";
import { SubscriptionPlanResponse } from "@/types/user";
import { api } from "@/utils/axiosInstance";
import { getTimeZone } from "@/utils/luxonUtil";
import { queryClient } from "@/utils/query-client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Purchases, { PACKAGE_TYPE, PurchasesPackage } from "react-native-purchases";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

interface CreateSubscription {
  originalPurchaseDate: number;
  latestPurchaseDate: number;
  expirationDate: number;
  store: string;
  zoneId: string;
}

const createPaidSubscription = async (requestBody: CreateSubscription) => {
  const response = await api.post<SubscriptionPlanResponse>("subscriptions", requestBody);
  return response.data;
};

const getPackage = (pkgs: PurchasesPackage[] | undefined, type: PACKAGE_TYPE) => {
  return pkgs?.find((pkg) => pkg.packageType === type);
};

export default function SubscriptionPlan() {
  const { t } = useTranslation();
  const isAndroid = Platform.OS === "android";

  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [pkgs, setPkgs] = useState<PurchasesPackage[]>();
  const [selectedPkg, setSelectedPkg] = useState<PurchasesPackage>();
  const [purchaseIsInProcess, setPurchaseIsInProcess] = useState(false);

  const montly = getPackage(pkgs, Purchases.PACKAGE_TYPE.MONTHLY);
  const annualDiscount = getPackage(pkgs, Purchases.PACKAGE_TYPE.CUSTOM);
  const annual = getPackage(pkgs, Purchases.PACKAGE_TYPE.ANNUAL);

  const isMontly = montly?.identifier === selectedPkg?.identifier;
  const isAnnual = annualDiscount?.identifier === selectedPkg?.identifier;

  useEffect(() => {
    const getPackages = async () => {
      const offering = await Purchases.getOfferings();
      const pkgs = offering.all["default"].availablePackages;
      setPkgs(pkgs);
      const defaultPackage = getPackage(pkgs, Purchases.PACKAGE_TYPE.CUSTOM);
      setSelectedPkg(defaultPackage);
    };

    if (Platform.OS === "ios") {
      getPackages();
    }
  }, []);

  const { mutate } = useMutation({
    mutationFn: createPaidSubscription,
    async onSuccess(data) {
      await queryClient.invalidateQueries({ queryKey: [QueryKey.subscriptionPlan] });
    },
    onError(error) {
      console.log("An Error occur when try to create subscription: ", error);
    },
  });

  const subscribe = async () => {
    if (selectedPkg) {
      try {
        setPurchaseIsInProcess(true);
        const { customerInfo } = await Purchases.purchasePackage(selectedPkg);
        const entitlement = customerInfo.entitlements.active[ENTITLEMENT_KEY];
        router.dismissTo("/(tabs)/settings/subscription");

        const {
          originalPurchaseDateMillis,
          latestPurchaseDateMillis,
          expirationDateMillis,
          store,
        } = entitlement;
        const requestBody: CreateSubscription = {
          originalPurchaseDate: originalPurchaseDateMillis,
          latestPurchaseDate: latestPurchaseDateMillis,
          expirationDate: expirationDateMillis ?? 0,
          store,
          zoneId: getTimeZone(),
        };
        mutate(requestBody);
      } catch (error) {
        console.log("Purchase Error Occur: ", error);
        return;
      } finally {
        setPurchaseIsInProcess(false);
      }
    }
  };

  // Themes
  const color = useThemeColor({}, "textPrimary");
  const tintColor = useThemeColor({}, "tint");
  const mutedColor = useThemeColor({}, "textMuted");
  const bgPrimary = useThemeColor({}, "backgroundPrimary");
  const bgSecondary = useThemeColor({}, "backgroundSecondary");
  const borderColor = useThemeColor({}, "borderColor");
  const bgTertiary = useThemeColor({}, "backgroundTertiary");

  const top = isAndroid ? insets.top + 20 : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgPrimary, paddingTop: top }} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.contentStyle}>
        {/* HEADERS */}
        <View style={styles.headerContainer}>
          <View style={[styles.headerIcon, { backgroundColor: bgTertiary }]}>
            <StarIcon color={tintColor} />
          </View>
          <Text style={[styles.headerTitle, { color }]}>
            {t("settings_screen.subscription_plans_title")}
          </Text>
          <Text style={[styles.headerSubTitle, { color: mutedColor }]}>
            {t("settings_screen.subscription_plans_sub_title")}
          </Text>
        </View>

        {/* INCLUDED OFFERS */}
        <View style={styles.bodyListWrapper}>
          <Text style={[styles.bodyTitle, { color }]}>
            {t("settings_screen.subscription_plans_offering_heading")}
          </Text>

          <View style={styles.list}>
            <SettingsCard
              title={t("settings_screen.subscription_plans_offering1_title")}
              description={t("settings_screen.subscription_plans_offering1_description")}
              svgIcon={<CheckCircleIcon />}
              interaction="none"
            />

            <SettingsCard
              title={t("settings_screen.subscription_plans_offering2_title")}
              description={t("settings_screen.subscription_plans_offering2_description")}
              svgIcon={<CheckCircleIcon />}
              interaction="none"
            />

            <SettingsCard
              title={t("settings_screen.subscription_plans_offering3_title")}
              description={t("settings_screen.subscription_plans_offering3_description")}
              svgIcon={<CheckCircleIcon />}
              interaction="none"
            />

            <SettingsCard
              title={t("settings_screen.subscription_plans_offering4_title")}
              description={t("settings_screen.subscription_plans_offering4_description")}
              svgIcon={<CheckCircleIcon />}
              interaction="none"
            />
          </View>
        </View>

        {/* PLAN COST */}
        <View style={styles.priceList}>
          {/* MONTHLY */}
          <Pressable
            style={[styles.pricePressable, { backgroundColor: bgSecondary }]}
            onPress={() => setSelectedPkg(montly)}
          >
            <View style={styles.pricePressableHead}>
              <Text style={[styles.pricePressableTitle, { color }]}>
                {t("settings_screen.subscription_plans_monthly_title")}
              </Text>
              <View
                style={[
                  styles.pricePressableActiveWrapper,
                  {
                    borderWidth: isMontly ? 0 : 3,
                    borderColor,
                    backgroundColor: isMontly ? tintColor : undefined,
                  },
                ]}
              >
                {isMontly && <CheckIcon />}
              </View>
            </View>

            <View style={[styles.pricePressableTextWrapper]}>
              <Text style={[styles.pricePressableBoldText, { color }]}>
                {montly?.product.priceString}
              </Text>
              <Text style={[styles.pricePressableThinText, { color: mutedColor }]}>/</Text>
              <Text style={[styles.pricePressableThinText, { color: mutedColor }]}>
                {t("settings_screen.subscription_plans_monthly_price_label")}
              </Text>
            </View>
          </Pressable>

          {/* ANNUAL */}
          <Pressable
            style={[styles.pricePressable, { backgroundColor: bgSecondary }]}
            onPress={() => setSelectedPkg(annualDiscount)}
          >
            <View style={styles.pricePressableHead}>
              <Text style={[styles.pricePressableTitle, { color }]}>
                {t("settings_screen.subscription_plans_yearly_title")}
              </Text>
              <View
                style={[
                  styles.pricePressableActiveWrapper,
                  {
                    borderWidth: isAnnual ? 0 : 3,
                    borderColor,
                    backgroundColor: isAnnual ? tintColor : undefined,
                  },
                ]}
              >
                {isAnnual && <CheckIcon />}
              </View>
            </View>

            <View style={[styles.discountLabelWrapper, { backgroundColor: bgTertiary }]}>
              <Text style={[styles.discountLabel, { color: tintColor }]}>
                {t("settings_screen.subscription_plans_yearly_discount_label")} 15%
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                justifyContent: "space-between",
              }}
            >
              <View style={[styles.pricePressableTextWrapper]}>
                <Text style={[styles.pricePressableBoldText, { color }]}>
                  {annualDiscount?.product.priceString}
                </Text>
                <Text style={[styles.pricePressableThinText, { color: mutedColor }]}>/</Text>
                <Text style={[styles.pricePressableThinText, { color: mutedColor }]}>
                  {t("settings_screen.subscription_plans_yearly_price_label")}
                </Text>
              </View>

              <View style={styles.discountValueWrapper}>
                <View style={[styles.lineStroke, { backgroundColor: mutedColor }]} />
                <Text style={[styles.discountValue, { color: mutedColor }]}>
                  {annual?.product.priceString}/
                  {t("settings_screen.subscription_plans_yearly_price_label")}
                </Text>
              </View>
            </View>
          </Pressable>
        </View>

        <CustomButton
          label={t("common.continue")}
          onPress={subscribe}
          disabled={purchaseIsInProcess}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentStyle: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    gap: 32,
  },
  headerContainer: {
    alignItems: "center",
    gap: 12,
  },
  headerIcon: {
    width: 100,
    height: 100,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: "Roboto_500Medium",
    fontSize: 28,
    lineHeight: 32,
    textAlign: "center",
  },
  headerSubTitle: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    lineHeight: 19.2,
    textAlign: "center",
    width: 300,
  },
  bodyListWrapper: {
    gap: 16,
  },
  bodyTitle: {
    fontFamily: "Roboto_500Medium",
    fontSize: 18,
    lineHeight: 24,
  },
  list: {
    gap: 16,
  },
  priceList: {
    gap: 16,
  },
  pricePressable: {
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },

  pricePressableHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  pricePressableTitle: {
    fontFamily: "Roboto_500Medium",
    fontSize: 20,
    lineHeight: 28,
  },
  pricePressableActiveWrapper: {
    width: 24,
    height: 24,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },

  pricePressableTextWrapper: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  pricePressableBoldText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 28,
    lineHeight: 36,
  },
  pricePressableThinText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
    lineHeight: 19.2,
  },

  discountLabelWrapper: {
    width: 87,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  discountLabel: {
    fontFamily: "Roboto_400Regular",
    fontSize: 12,
    lineHeight: 14.2,
  },

  discountValueWrapper: {
    position: "relative",
    height: 19.2,
  },
  discountValue: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    lineHeight: 16.2,
  },
  lineStroke: {
    width: "100%",
    height: 1.2,
    position: "absolute",
    top: 7,
  },
});
