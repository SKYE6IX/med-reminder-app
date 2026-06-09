import { useThemeColor } from "@/hooks/use-theme-color";
import { useRouter } from "expo-router";
import { RefObject, useCallback, useImperativeHandle, useState } from "react";
import { Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, useDerivedValue, withTiming } from "react-native-reanimated";
import StarIcon from "../icons/star-icon";
import CustomButton from "./custom-button/custom-button";

export interface SubscriptionBannerRef {
  toggleBanner: () => void;
}

type SubscriptionBannerProps = {
  ref: RefObject<SubscriptionBannerRef | null> | null;
  onModalClose?: () => void;
};

const DURATION = 500;
export default function SubscriptionBanner({ ref, onModalClose }: SubscriptionBannerProps) {
  const isAndroid = Platform.OS === "android";
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  const progress = useDerivedValue(() => withTiming(showModal ? 0 : 1, { duration: DURATION }));
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
  }));

  const color = useThemeColor({}, "textPrimary");
  const tintColor = useThemeColor({}, "tint");
  const mutedColor = useThemeColor({}, "textMuted");
  const bgSecondary = useThemeColor({}, "backgroundSecondary");
  const bgTertiary = useThemeColor({}, "backgroundTertiary");

  const toggleBanner = useCallback(() => {
    setModalKey((prev) => prev + 1);
    setShowModal((prv) => !prv);
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      toggleBanner() {
        toggleBanner();
      },
    }),
    [toggleBanner],
  );

  const navigateToSubscritionPlan = () => {
    toggleBanner();
    router.navigate("/(tabs)/settings/subscription-plan");

    // On android, the navigation fall back to the index setting page
    // we add a little delay after the initial to push the real page we
    // want
    if (isAndroid) {
      setTimeout(() => {
        router.push("/(tabs)/settings/subscription-plan");
      }, 300);
    }
  };

  const closeModal = () => {
    toggleBanner();
    onModalClose && onModalClose();
  };

  return (
    <Modal
      key={modalKey}
      visible={showModal}
      animationType="slide"
      transparent={true}
      presentationStyle="overFullScreen"
      onRequestClose={() => setShowModal(false)}
    >
      <View style={styles.container}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <TouchableOpacity style={{ flex: 1 }} onPress={closeModal} />
        </Animated.View>
        <View style={[styles.contentWrapper, { backgroundColor: bgSecondary }]}>
          <View style={[styles.headerIcon, { backgroundColor: bgTertiary }]}>
            <StarIcon color={tintColor} width={33} height={35} />
          </View>

          <Text style={[styles.contentTitle, { color }]}>Разблокировать премиум-функции</Text>
          <Text style={[styles.contentSubtitle, { color: mutedColor }]}>
            Добавляйте неограниченное количество лекарств, настраивайте напоминания и управляйте
            лекарствами всей семьи.
          </Text>

          <View style={styles.buttonWrapper}>
            <CustomButton label="Продолжить" onPress={navigateToSubscritionPlan} />
            <CustomButton
              label="Пропустить"
              variant="outline"
              textVaraint="mutedText"
              onPress={closeModal}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingLeft: 20,
    paddingRight: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  contentWrapper: {
    width: "100%",
    height: 345,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 16,
  },
  headerIcon: {
    width: 55,
    height: 55,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  contentTitle: {
    fontFamily: "Roboto_500Medium",
    fontSize: 18,
    lineHeight: 24,
    textAlign: "center",
  },
  contentSubtitle: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    lineHeight: 16.2,
    textAlign: "center",
  },
  buttonWrapper: {
    alignSelf: "stretch",
    gap: 8,
  },
});
