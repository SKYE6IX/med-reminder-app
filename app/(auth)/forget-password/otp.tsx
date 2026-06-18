import { ThemedText } from "@/component/themed-text/themed-text";
import CustomButton from "@/component/ui/custom-button/custom-button";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Link, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputKeyPressEvent,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OTPVerificationScreen() {
  const router = useRouter();
  const TOKEN_LENGTH = 5;
  const insets = useSafeAreaInsets();
  const inputRefs = useRef<TextInput[]>([]);

  const [token, setToken] = useState("");
  const [values, setValues] = useState<string[]>(new Array(TOKEN_LENGTH).fill(""));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const inputBgColor = useThemeColor({}, "backgroundSecondary");
  const backgroundColor = useThemeColor({}, "backgroundPrimary");
  const inputBorderColor = useThemeColor({}, "borderColor");
  const tintColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "textPrimary");

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
      setValues(newValues);
      setToken(newValues.join(""));
      inputRefs.current[TOKEN_LENGTH - 1].focus();
    } else {
      // It's single digit
      const digit = text.replace(/\D/g, "");
      const newValues = [...values];
      newValues[index] = digit;
      setValues(newValues);
      const token = newValues.join("");
      setToken(token);
      if (digit && index < TOKEN_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleOnKeyPress = (event: TextInputKeyPressEvent, index: number) => {
    if (event.nativeEvent.key === "Backspace") {
      const newValues = [...values];
      newValues[index] = "";
      setValues(newValues);
      const token = newValues.join("");
      setToken(token);
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <ScrollView contentContainerStyle={{ paddingTop: insets.top * 2, backgroundColor }}>
      <View style={[{ paddingBottom: insets.bottom }, styles.container]}>
        <View style={styles.headerWrapper}>
          <ThemedText type="title" style={styles.title}>
            Введите код
          </ThemedText>
          <ThemedText type="subtitle" style={styles.subtitle}>
            Мы отправили код подтверждения на вашу почту ivan.ivanov@gmail.com{" "}
            <Link href="/forget-password" style={[styles.link, { color: tintColor }]}>
              Изменить
            </Link>
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
                    borderColor: focusedIndex === i ? tintColor : inputBorderColor,
                  },
                ]}
                value={values[i]}
                onChangeText={(text) => handleOnChange(text, i)}
                onKeyPress={(event) => handleOnKeyPress(event, i)}
                autoFocus={i === 0}
                maxLength={1}
                textContentType="oneTimeCode"
                keyboardType="number-pad"
                autoComplete="sms-otp"
                selectTextOnFocus
                onFocus={() => setFocusedIndex(i)}
                onBlur={() => {
                  setFocusedIndex(null);
                }}
              />
            ))}
          </View>

          <View style={styles.bodyBottom}>
            <ThemedText style={[{ color: textColor }, styles.bodyBottomText]}>
              Не получили код?{" "}
            </ThemedText>
            <Pressable>
              <Text style={[{ color: tintColor }, styles.bodyBottomText]}>Отправить повторно</Text>
            </Pressable>
          </View>
        </View>

        <CustomButton
          label="Продолжить"
          style={styles.button}
          onPress={() => router.navigate("/forget-password/new-password")}
        />
      </View>
    </ScrollView>
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
  link: {
    fontFamily: "Roboto_500Medium",
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
    gap: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  bodyBottomText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 12,
    lineHeight: 14.4,
  },
  button: {
    marginTop: 32,
  },
});
