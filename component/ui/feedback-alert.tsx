import { useThemeColor } from "@/hooks/use-theme-color";
import { useFeedBackStore } from "@/stores/feedback-store";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CloseIcon from "../icons/close-icon";
import ExclamationCircleIcon from "../icons/exclamation-circle-icon";
import ShieldCheckIcon from "../icons/shield-check-icon";

export default function FeedbackAlert() {
  const insets = useSafeAreaInsets();
  const { visible, status, title, message, hideFeedBack } = useFeedBackStore();

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-80);
  const top = insets.top;

  // Handle Animations
  useEffect(() => {
    const DURATION = 250;
    if (visible) {
      opacity.value = withTiming(1, {
        duration: DURATION,
        easing: Easing.out(Easing.ease),
      });
      translateY.value = withTiming(top, {
        duration: 350,
        easing: Easing.out(Easing.back(1.4)),
      });
    } else if (!visible) {
      opacity.value = withTiming(0, { duration: DURATION, easing: Easing.out(Easing.ease) });
      translateY.value = withTiming(-80, {
        duration: 300,
        easing: Easing.in(Easing.ease),
      });
    }
  }, [opacity, top, translateY, visible]);

  // Auto hide the animation if user doesn't react to it
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (visible) {
      timeout = setTimeout(() => {
        useFeedBackStore.getState().hideFeedBack();
      }, 4000);
    }
    return () => clearTimeout(timeout);
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const isSuccess = status === "success";
  const successColor = useThemeColor({}, "feedbackSuccess");
  const successColorBg = useThemeColor({}, "feedbackSuccessBg");
  const successColorText = useThemeColor({}, "feedbackSuccessText");
  const errorColor = useThemeColor({}, "feedbackError");
  const errorColorBg = useThemeColor({}, "feedbackErrorBg");
  const errorColorText = useThemeColor({}, "feedbackErrorText");

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View
        style={[
          styles.wrapper,
          {
            backgroundColor: isSuccess ? successColorBg : errorColorBg,
            borderColor: isSuccess ? successColor : errorColor,
          },
        ]}
      >
        <View style={[styles.icon, { backgroundColor: isSuccess ? successColor : errorColor }]}>
          {isSuccess ? <ShieldCheckIcon /> : <ExclamationCircleIcon color="#fff" />}
        </View>
        <View style={styles.textWrapper}>
          <Text style={[styles.title, { color: isSuccess ? successColorText : errorColorText }]}>
            {title}
          </Text>
          <Text style={[styles.message, { color: isSuccess ? successColorText : errorColorText }]}>
            {message}
          </Text>
        </View>
        <Pressable style={styles.closeIcon} onPress={hideFeedBack}>
          <CloseIcon color={isSuccess ? successColorText : errorColorText} />
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingLeft: 20,
    paddingRight: 20,
    zIndex: 1000,
  },
  wrapper: {
    width: "100%",
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    gap: 16,
    borderRadius: 12,
    borderWidth: 1,
    position: "relative",
  },
  icon: {
    width: 46,
    height: 46,
    borderRadius: 46,
    justifyContent: "center",
    alignItems: "center",
  },
  textWrapper: {
    gap: 8,
  },
  title: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    lineHeight: 16.8,
  },
  message: {
    fontFamily: "Roboto_400Regular",
    fontSize: 12,
    lineHeight: 14.4,
    maxWidth: 220,
  },
  closeIcon: {
    position: "absolute",
    right: 16,
    top: 16,
  },
});
