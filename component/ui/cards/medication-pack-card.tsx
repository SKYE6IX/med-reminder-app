import { useThemeColor } from "@/hooks/use-theme-color";
import { lng, useTranslation } from "@/i18next/i18next";
import { MedicationPackResponse } from "@/types/medication";
import { formatRegularDate, getDateLocalString } from "@/utils/luxonUtil";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import { useCardStyles } from "./use-card-style";

type RefillCardProps = {
  pack: MedicationPackResponse;
  onRefillButtonPress: () => void;
};

const getProgressText = (pack: MedicationPackResponse) => {
  const consumed = Number(pack.totalQuantity) - Number(pack.currentQuantity);
  const isRU = lng === "ru";
  return `${consumed} ${isRU ? "из" : "of"} ${pack.totalQuantity} ${isRU ? "принято" : "taken"}`;
};
const getPercentage = (pack: MedicationPackResponse) => {
  const consumed = Number(pack.totalQuantity) - Number(pack.currentQuantity);
  return Math.round((consumed / Number(pack.totalQuantity)) * 100);
};
const getStartedDate = (isoString: string | null) => {
  if (!isoString) return;
  const date = new Date(isoString);
  const convertedString = getDateLocalString(date).replaceAll(".", " ");
  return formatRegularDate(convertedString);
};

const isPackDepleted = (pack: MedicationPackResponse) => {
  if (pack.status === "ACTIVE") {
    const daysSupply = Math.round(Number(pack.currentQuantity) / Number(pack.dosageAmount));
    return daysSupply < pack.reminderDays && !pack.isRefilled;
  } else {
    return false;
  }
};

export default function MedicationPackCard({ pack, onRefillButtonPress }: RefillCardProps) {
  const { t } = useTranslation();

  const sharedStyles = useCardStyles();

  const statusLabel =
    pack.status === "ACTIVE"
      ? t("medication_reserve_screen.card_status_active_label")
      : pack.status === "PENDING"
        ? t("medication_reserve_screen.card_status_pending_label")
        : t("medication_reserve_screen.card_status_complete_label");

  const startedDate = getStartedDate(pack.startedAt);
  const endedDate = getStartedDate(pack.endedAt);
  const showRefillButton = pack.status !== "PENDING" && !pack.isRefilled;

  const badgeLabel =
    pack.status === "ACTIVE" && isPackDepleted(pack)
      ? t("medication_reserve_screen.card_badge_depleted_label")
      : pack.status === "ACTIVE" && pack.isRefilled
        ? t("medication_reserve_screen.card_badge_refilled_label")
        : pack.status === "PENDING"
          ? t("medication_reserve_screen.card_badge_refilled_label")
          : t("medication_reserve_screen.card_badge_complete_label");

  const badgeColor =
    pack.status === "ACTIVE" && isPackDepleted(pack)
      ? "#DC0000"
      : pack.status === "ACTIVE" && pack.isRefilled
        ? "#009E00"
        : pack.status === "PENDING"
          ? "#009E00"
          : "#9E9E9E";

  const tintColor = useThemeColor({}, "tint");

  return (
    <View style={sharedStyles.card}>
      {/* Container */}
      <View style={sharedStyles.cardInnerContainer}>
        {/* Image Wrapper */}
        <View style={sharedStyles.cardImageWrapper}>
          <Image
            source={require("@/assets/images/pill-bottle.png")}
            style={sharedStyles.cardImage}
            contentFit="contain"
            contentPosition="top center"
          />
        </View>
        {/* Content Wrapper */}
        <View style={[sharedStyles.cardContent, { gap: 5 }]}>
          <Text style={sharedStyles.cardTextLarge}>{pack.medicationName}</Text>
          <Text style={sharedStyles.cardTextMedium}>{statusLabel}</Text>

          {pack.startedAt && pack.status === "ACTIVE" && (
            <Text style={sharedStyles.cardTextMedium}>
              {t("medication_reserve_screen.card_start_at", { date: startedDate ?? "" })}
            </Text>
          )}

          {pack.endedAt && pack.status === "COMPLETED" && (
            <Text style={sharedStyles.cardTextMedium}>
              {t("medication_reserve_screen.card_end_at", { date: endedDate ?? "" })}
            </Text>
          )}

          {/* This button will only shown for Active pack that need to be refilled */}
          {showRefillButton && (
            <Pressable style={sharedStyles.cardActionButton} onPress={onRefillButtonPress}>
              <Text style={sharedStyles.cardActionButtonText}>
                {t("medication_reserve_screen.card_refill_btn")}
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      <View style={sharedStyles.progressContainer}>
        <View style={sharedStyles.progressHeader}>
          <Text style={sharedStyles.progressTextValue}>{getProgressText(pack)}</Text>
          <Text style={[sharedStyles.progressTextValue, { color: tintColor }]}>
            {getPercentage(pack)}%
          </Text>
        </View>
        <View style={sharedStyles.progressPipe}>
          <View
            style={[
              sharedStyles.progressActivePipe,
              {
                backgroundColor: tintColor,
                width: `${getPercentage(pack) ?? 0}%`,
              },
            ]}
          />
        </View>
      </View>

      {/* Badge will be shown for a pending pack, to indicate a pack as been added! */}
      {(isPackDepleted(pack) ||
        (pack.status === "ACTIVE" && pack.isRefilled) ||
        pack.status === "PENDING" ||
        pack.status === "COMPLETED") && (
        <View style={[sharedStyles.badge, { backgroundColor: badgeColor }]}>
          <Text style={sharedStyles.badgeText}>{badgeLabel}</Text>
        </View>
      )}
    </View>
  );
}
