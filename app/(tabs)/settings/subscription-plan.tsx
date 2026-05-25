import CheckCircleIcon from "@/component/icons/check-circle-icon";
import CheckIcon from "@/component/icons/check-icon";
import StarIcon from "@/component/icons/star-icon";
import CustomButton from "@/component/ui/custom-button/custom-button";
import SettingsCard from "@/component/ui/settings/settings-card";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

type Plan = "MONTHLY" | "ANNUAL";

export default function SubscriptionPlan() {
  const [selectedPlan, setSelectedPlan] = useState<Plan>("ANNUAL");

  const isAndroid = Platform.OS === "android";
  const insets = useSafeAreaInsets();

  const color = useThemeColor({}, "textPrimary");
  const tintColor = useThemeColor({}, "tint");
  const mutedColor = useThemeColor({}, "textMuted");
  const bgPrimary = useThemeColor({}, "backgroundPrimary");
  const bgSecondary = useThemeColor({}, "backgroundSecondary");
  const borderColor = useThemeColor({}, "borderColor");
  const bgTertiary = useThemeColor({}, "backgroundTertiary");

  const isMontly = selectedPlan === "MONTHLY";
  const isAnnual = selectedPlan === "ANNUAL";

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgPrimary }]} edges={["top"]}>
      <ScrollView
        contentContainerStyle={[
          [styles.scrollView, { paddingTop: isAndroid ? insets.top + 10 : 0, paddingBottom: 10 }],
        ]}
      >
        {/* HEADERS */}
        <View style={styles.headerContainer}>
          <View style={[styles.headerIcon, { backgroundColor: bgTertiary }]}>
            <StarIcon color={tintColor} />
          </View>
          <Text style={[styles.headerTitle, { color }]}>Премиум план</Text>
          <Text style={[styles.headerSubTitle, { color: mutedColor }]}>
            Всё, чтобы эффективно следить за приёмом лекарств
          </Text>
        </View>

        {/* INCLUDED OFFERS */}
        <View style={styles.bodyListWrapper}>
          <Text style={[styles.bodyTitle, { color }]}>Что включено</Text>
          <View style={styles.list}>
            <SettingsCard
              title="Неограниченное количество лекарств"
              description="Добавляйте и отслеживайте любое количество лекарств без ограничений"
              svgIcon={<CheckCircleIcon />}
              interaction="none"
            />

            <SettingsCard
              title="Следите за лекарствами всей семьи"
              description="Добавьте до трёх родственников и легко управляйте их расписанием приёма лекарств."
              svgIcon={<CheckCircleIcon />}
              interaction="none"
            />

            <SettingsCard
              title="Контроль запасов лекарств"
              description="Уведомления о том, что лекарства заканчиваются"
              svgIcon={<CheckCircleIcon />}
              interaction="none"
            />

            <SettingsCard
              title="Персонализировать уведомления"
              description="Управляйте уведомлениями: настройте звук и время повтора"
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
            onPress={() => setSelectedPlan("MONTHLY")}
          >
            <View style={styles.pricePressableHead}>
              <Text style={[styles.pricePressableTitle, { color }]}>Премиум — ежемесячно</Text>
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
              <Text style={[styles.pricePressableBoldText, { color }]}>299₽</Text>
              <Text style={[styles.pricePressableThinText, { color: mutedColor }]}>/</Text>
              <Text style={[styles.pricePressableThinText, { color: mutedColor }]}>месяц</Text>
            </View>
          </Pressable>

          {/* ANNUAL */}
          <Pressable
            style={[styles.pricePressable, { backgroundColor: bgSecondary }]}
            onPress={() => setSelectedPlan("ANNUAL")}
          >
            <View style={styles.pricePressableHead}>
              <Text style={[styles.pricePressableTitle, { color }]}>Премиум — годовая</Text>
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
              <Text style={[styles.discountLabel, { color: tintColor }]}>Выгода 15%</Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                justifyContent: "space-between",
              }}
            >
              <View style={[styles.pricePressableTextWrapper]}>
                <Text style={[styles.pricePressableBoldText, { color }]}>3050₽</Text>
                <Text style={[styles.pricePressableThinText, { color: mutedColor }]}>/</Text>
                <Text style={[styles.pricePressableThinText, { color: mutedColor }]}>год</Text>
              </View>

              <View style={styles.discountValueWrapper}>
                <View style={[styles.lineStroke, { backgroundColor: mutedColor }]} />
                <Text style={[styles.discountValue, { color: mutedColor }]}>3588₽/год</Text>
              </View>
            </View>
          </Pressable>
        </View>

        <CustomButton label="Продолжить" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    paddingLeft: 20,
    paddingRight: 20,
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
    fontSize: 36,
    lineHeight: 42,
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
