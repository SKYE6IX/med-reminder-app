import { ThemedText } from "@/component/themed-text/themed-text";
import CustomButton from "@/component/ui/custom-button/custom-button";
import Loader from "@/component/ui/loader";
import { readFromStorage, saveToStorage } from "@/helpers/storage-manager";
import { useRequestResetPasswordToken } from "@/hooks/use-request-reset-password-token";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useFeedBackStore } from "@/stores/feedback-store";
import { api } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputKeyPressEvent,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

interface OTPState {
  userEmail: string;
  token: string;
  inputValues: string[];
  focusedIndex: number | null;
  retryAfter: number;
}

const STORAGE_KEY_TOKEN = "password:reset:token";
const STORAGE_KEY_EMAIL = "password:reset:email";

const maskEmailAddress = (email: string) => {
  if (email) {
    const masked = email.replace(/^(.)([^@]*)(@.*)$/, (_, first, middle, domain) => {
      return first + "*".repeat(middle.length) + domain;
    });
    return masked;
  }
  return "";
};

const verifyPasswordResetToken = async ({ email, token }: { email: string; token: number }) => {
  const response = await api.get<{ status: string }>("auth/forget-password/token", {
    params: { email, token },
  });
  return response.data;
};

const TOKEN_LENGTH = 6;
const RETRY_AFTER_SECONDS = 60;

export default function OTPVerificationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const inputRefs = useRef<TextInput[]>([]);

  const { showFeedBack } = useFeedBackStore();
  const { requestResetPasswordToken } = useRequestResetPasswordToken({ onSuccessAction() {} });

  const [otpState, setOtpState] = useState<OTPState>({
    userEmail: "",
    token: "",
    inputValues: new Array(TOKEN_LENGTH).fill(""),
    focusedIndex: null,
    retryAfter: RETRY_AFTER_SECONDS,
  });

  // Consumed the user email from an Async local storage for
  // consumptions
  useEffect(() => {
    const readValueFromStorage = async () => {
      const email = await readFromStorage<string>(STORAGE_KEY_EMAIL);
      if (email) {
        setOtpState((state) => ({ ...state, userEmail: email }));
      }
    };
    readValueFromStorage();
  }, []);

  // Implement timer for rate limit, which user need to wait
  // before they can request for a new token in case the
  //  previuos sent isn't available
  useEffect(() => {
    if (otpState.retryAfter <= 0) return;
    const t = setInterval(
      () => setOtpState((state) => ({ ...state, retryAfter: state.retryAfter - 1 })),
      1000,
    );
    return () => clearInterval(t);
  }, [otpState.retryAfter]);

  const isTokenFilled = otpState.token.length === TOKEN_LENGTH;
  const handleOnChange = (text: string, index: number) => {
    // Let check if user paste the token
    if (text.replace(/\D/g, "").length === TOKEN_LENGTH) {
      const digits = text.replace(/\D/g, "").slice(0, TOKEN_LENGTH).split("");
      const newValues = new Array("").fill("");
      digits.forEach((d, i) => {
        if (i < TOKEN_LENGTH) {
          newValues[i] = d;
        }
      });
      setOtpState((state) => ({ ...state, inputValues: newValues }));
      setOtpState((state) => ({ ...state, token: newValues.join("") }));
      inputRefs.current[TOKEN_LENGTH - 1].focus();
    } else {
      // It's single digit
      const digit = text.replace(/\D/g, "");
      const newValues = [...otpState.inputValues];
      newValues[index] = digit;
      setOtpState((state) => ({ ...state, inputValues: newValues }));
      const token = newValues.join("");
      setOtpState((state) => ({ ...state, token }));
      if (digit && index < TOKEN_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleOnKeyPress = (event: TextInputKeyPressEvent, index: number) => {
    if (event.nativeEvent.key === "Backspace") {
      const newValues = [...otpState.inputValues];
      newValues[index] = "";
      setOtpState((state) => ({ ...state, inputValues: newValues }));
      const token = newValues.join("");
      setOtpState((state) => ({ ...state, token }));
      inputRefs.current[index - 1]?.focus();
    }
  };

  const { refetch, isLoading } = useQuery({
    queryKey: ["token-verification"],
    queryFn: () => {
      return verifyPasswordResetToken({ email: otpState.userEmail, token: Number(otpState.token) });
    },
    enabled: false,
  });

  const handleVerifyToken = () => {
    refetch({ throwOnError: true })
      .then(async () => {
        router.navigate("/forget-password/new-password");
        await saveToStorage(STORAGE_KEY_TOKEN, otpState.token);
        setOtpState((state) => ({ ...state, inputValues: new Array(TOKEN_LENGTH).fill("") }));
      })
      .catch(() => {
        showFeedBack({
          title: "Не удалось авторизовать!",
          message: "Просроченный или недействительный код.",
          status: "error",
        });
      });
  };

  // Themes
  const inputBgColor = useThemeColor({}, "backgroundSecondary");
  const backgroundColor = useThemeColor({}, "backgroundPrimary");
  const inputBorderColor = useThemeColor({}, "borderColor");
  const tintColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "textPrimary");
  const filledBorderColor = useThemeColor({}, "feedbackSuccess");

  return (
    <SafeAreaView style={{ paddingTop: insets.top + 10, backgroundColor, flex: 1 }}>
      <ScrollView>
        <View style={styles.container}>
          <Loader visible={isLoading} />
          <View style={styles.headerWrapper}>
            <ThemedText type="title" style={styles.title}>
              Введите код
            </ThemedText>
            <ThemedText type="subtitle" style={styles.subtitle}>
              Мы отправили код подтверждения на вашу почту {maskEmailAddress(otpState.userEmail)}{" "}
              <Text
                onPress={() => router.back()}
                style={[styles.changeEmaiAction, { color: tintColor }]}
                suppressHighlighting
              >
                Изменить
              </Text>
            </ThemedText>
          </View>

          <View style={styles.bodyWrapper}>
            <View style={styles.inputRow}>
              {Array.from({ length: TOKEN_LENGTH }).map((_, i) => (
                <TextInput
                  key={i}
                  ref={(el) => {
                    if (el) {
                      inputRefs.current[i] = el;
                    }
                  }}
                  style={[
                    styles.input,
                    {
                      color: textColor,
                      backgroundColor: inputBgColor,
                      borderColor: isTokenFilled
                        ? filledBorderColor
                        : otpState.focusedIndex === i
                          ? tintColor
                          : inputBorderColor,
                    },
                  ]}
                  value={otpState.inputValues[i]}
                  onChangeText={(text) => handleOnChange(text, i)}
                  onKeyPress={(event) => handleOnKeyPress(event, i)}
                  autoFocus={i === 0}
                  textContentType="oneTimeCode"
                  keyboardType="number-pad"
                  autoComplete="sms-otp"
                  selectTextOnFocus
                  onFocus={() => setOtpState((state) => ({ ...state, focusedIndex: i }))}
                  onBlur={() => {
                    setOtpState((state) => ({ ...state, focusedIndex: null }));
                  }}
                />
              ))}
            </View>

            <View style={styles.bodyBottom}>
              <ThemedText style={[styles.bodyBottomText, { color: textColor }]}>
                Не получили код?{" "}
              </ThemedText>
              {otpState.retryAfter <= 0 ? (
                <Pressable
                  onPress={() => {
                    requestResetPasswordToken({ email: otpState.userEmail });
                  }}
                >
                  <Text style={[styles.bodyBottomText, { color: tintColor }]}>
                    Отправить повторно
                  </Text>
                </Pressable>
              ) : (
                <Text style={[styles.bodyBottomText, { color: textColor }]}>
                  Ещё раз {`через 00:${String(otpState.retryAfter).padStart(2, "0")}`}
                </Text>
              )}
            </View>
          </View>

          <CustomButton
            label="Продолжить"
            style={styles.button}
            onPress={handleVerifyToken}
            disabled={!isTokenFilled}
            variant={isTokenFilled ? "filled" : "disabled"}
            textVaraint={isTokenFilled ? "mutedText" : "regularText"}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    gap: 32,
  },
  headerWrapper: {
    gap: 8,
  },
  title: {
    textAlign: "left",
    fontSize: 20,
    lineHeight: 22,
  },
  subtitle: {
    textAlign: "left",
    fontSize: 15,
    lineHeight: 17.2,
  },
  changeEmaiAction: {
    fontFamily: "Roboto_500Medium",
    borderWidth: 1,
    borderColor: "red",
  },
  bodyWrapper: {
    gap: 16,
    alignItems: "center",
  },
  inputRow: {
    flexDirection: "row",
    width: "100%",
    gap: 8,
  },
  input: {
    height: 64,
    flex: 1,
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    textAlign: "center",
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    lineHeight: 16.2,
  },
  bodyBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  bodyBottomText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
    lineHeight: 18.2,
    textAlign: "center",
  },
  button: {
    marginTop: 32,
  },
});
