import CameraIcon from "@/component/icons/camera-icon";
import CustomButton from "@/component/ui/custom-button/custom-button";
import FormInput from "@/component/ui/form/form-input";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Image } from "expo-image";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { useUserStore } from "@/stores/user-store";

export default function Profile() {
  const { userData } = useUserStore();

  const isIOS = Platform.OS === "ios";
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();

  // Themes color
  const color = useThemeColor({}, "textPrimary");
  const mutedColor = useThemeColor({}, "textMuted");
  const tintColor = useThemeColor({}, "tint");
  const bgPrimary = useThemeColor({}, "backgroundPrimary");
  const bgTertiary = useThemeColor({}, "backgroundTertiary");
  const bgSecondary = useThemeColor({}, "backgroundSecondary");
  const borderColor = useThemeColor({}, "borderColor");

  const avatarPlaceholder =
    scheme === "dark"
      ? require("@/assets/images/avatar-placeholder-dark.png")
      : require("@/assets/images/avatar-placeholder-light.png");

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: bgPrimary }]}
      edges={isIOS ? ["top", "bottom"] : ["top"]}
    >
      <View style={[styles.container, { paddingTop: isIOS ? insets.top : insets.top + 10 }]}>
        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            <Image source={avatarPlaceholder} style={styles.avatar} />
            <View style={[styles.cameraIcon, { backgroundColor: bgTertiary }]}>
              <CameraIcon color={tintColor} />
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <FormInput
            label="Имя"
            placeholder={userData?.name}
            type="text"
            name="name"
            hasError={false}
            onValueChange={() => {}}
          />

          <FormInput
            label="Почта"
            placeholder={userData?.email}
            type="email"
            name="email"
            hasError={false}
            onValueChange={() => {}}
          />

          {/* DATE OF BIRTH */}
          <View style={styles.bodyItem}>
            <Text style={[styles.bodyItemLabel, { color }]}>Дата рождения</Text>
            <Pressable
              style={[styles.bodyItemPressable, { backgroundColor: bgSecondary, borderColor }]}
            >
              <Text style={[styles.bodyItemValue, { color: mutedColor }]}>
                {userData?.dateOfBirth || "Введите дату Вашего рождения"}
              </Text>
            </Pressable>
          </View>

          {/* GENDER */}
          <View style={styles.bodyItem}>
            <Text style={[styles.bodyItemLabel, { color }]}>Пол</Text>
            <Pressable
              style={[styles.bodyItemPressable, { backgroundColor: bgSecondary, borderColor }]}
            >
              <Text style={[styles.bodyItemValue, { color: mutedColor }]}>
                {userData?.gender || "Введите Ваш пол"}
              </Text>
            </Pressable>
          </View>
        </View>

        <CustomButton label="Сохранить" style={styles.button} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    gap: 32,
  },
  header: {
    alignItems: "center",
  },
  avatarWrapper: {
    width: 88,
    height: 88,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  avatar: {
    width: "95%",
    height: "95%",
  },
  cameraIcon: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 999,
    bottom: 2,
    right: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    gap: 16,
  },
  bodyItem: {
    gap: 8,
  },
  bodyItemLabel: {
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
    lineHeight: 19.2,
  },
  bodyItemValue: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    lineHeight: 16.2,
  },
  bodyItemPressable: {
    height: 48,
    borderWidth: 1,
    borderRadius: 16,
    paddingLeft: 16,
    paddingRight: 16,
    justifyContent: "center",
  },
  button: {
    marginTop: "auto",
  },
});
