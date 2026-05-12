import { RefillMedicationPack } from "@/types/medication";
import { formatRegularDate, getDateLocalString } from "@/utils/luxonUtil";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import { useCardStyles } from "./use-card-style";

type RefillCardProps = {
  pack: RefillMedicationPack;
  onRefillButtonPress: () => void;
};
const getStartedDate = (isoString: string) => {
  if (!isoString) return;
  const date = new Date(isoString);
  const convertedString = getDateLocalString(date).replaceAll(".", " ");
  return formatRegularDate(convertedString);
};

export default function RefillCard({ pack, onRefillButtonPress }: RefillCardProps) {
  const sharedStyles = useCardStyles();

  const startedDate = getStartedDate(pack.startedAt);

  const isDepleted = pack.status === "DEPLETED";
  const isRefilled = pack.status === "REFILLED";

  return (
    <View style={sharedStyles.card}>
      {/* Container */}
      <View style={sharedStyles.cardInnerContainer}>
        {/* Image Wrapper */}
        <View style={sharedStyles.cardImageWrapper}>
          <Image
            source={require("@/assets/images/pill.png")}
            style={sharedStyles.cardImage}
            contentFit="contain"
            contentPosition="top center"
          />
        </View>

        {/* Content Wrapper */}
        <View style={sharedStyles.cardContent}>
          <Text style={sharedStyles.cardTextLarge}>{pack.medicationName}</Text>

          {/* Same goes for the started date for info on when the active pack started */}
          {isDepleted && <Text style={sharedStyles.cardTextMedium}>Начало {startedDate}</Text>}

          {isRefilled && (
            <>
              {/* Information that the pack hasn't started yet */}
              <Text style={sharedStyles.cardTextMedium}>
                {startedDate ? `Начало ${startedDate}` : "Еще не началось."}
              </Text>
              {/* Information about how many of the pack was added */}
              <Text style={sharedStyles.cardTextLarge}>
                Добавлено {pack.totalQuantity} таблеток.
              </Text>
            </>
          )}

          {/* This button will only shown for Active pack that need to be refilled */}
          {isDepleted && (
            <Pressable style={sharedStyles.cardButton} onPress={onRefillButtonPress}>
              <Text style={sharedStyles.cardButtonText}>Пополнить</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Badge will be shown for a pending pack, to indicate a pack as been added! */}
      {isRefilled && (
        <View style={[sharedStyles.badge, { backgroundColor: "#009E00" }]}>
          <Text style={sharedStyles.badgeText}>Принятые</Text>
        </View>
      )}
    </View>
  );
}
