import CapsuleIcon from "@/component/icons/capsule-icon";
import Ellipsis from "@/component/icons/ellipsis";
import EyeDropIcon from "@/component/icons/eye-drop-icon";
import InjectionIcon from "@/component/icons/injection-icon";
import PersonIcon from "@/component/icons/person-icon";
import PlusIcon from "@/component/icons/plus-icon";
import SprayIcon from "@/component/icons/spray-icon";
import SyrupBottleIcon from "@/component/icons/syrup-bottle-icon";
import TabletIcon from "@/component/icons/tablet-icon";
import { useAddPillScreenStyles } from "@/component/shared-styles/add-pill-screen-styles";
import CustomButton from "@/component/ui/custom-button/custom-button";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

const pillsFormList = [
  { name: "Капсулы", icon: CapsuleIcon },
  { name: "Таблетки", icon: TabletIcon },
  { name: "Инъекции", icon: InjectionIcon },
  { name: "Спрей", icon: SprayIcon },
  { name: "Капли", icon: EyeDropIcon },
  { name: "Сироп", icon: SyrupBottleIcon },
  { name: "Другое", icon: Ellipsis },
];

export default function DetailsStepScreen() {
  const router = useRouter();
  const sharedStyles = useAddPillScreenStyles();

  const color = useThemeColor({}, "textPrimary");
  const tintColor = useThemeColor({}, "tint");
  const bGColor = useThemeColor({}, "backgroundSecondary");
  const borderColor = useThemeColor({}, "borderColor");
  return (
    <View style={[styles.container, sharedStyles.container]}>
      {/* Form selections */}
      <View style={styles.pillFormContainer}>
        <Text style={sharedStyles.title}>Выберите форму лекарства</Text>
        <View style={styles.pillFormWrapper}>
          {pillsFormList.map((item, i) => (
            <View key={item.name + i} style={styles.pillForm}>
              <Pressable
                style={[
                  styles.pillFormPressable,
                  { borderColor: borderColor, backgroundColor: bGColor },
                ]}
              >
                <item.icon color={color} />
              </Pressable>
              <Text style={[styles.pillFormName, { color }]}>{item.name}</Text>
            </View>
          ))}
          <View style={styles.ghostWrapper} />
        </View>
      </View>

      {/* Profile selection*/}
      <View style={styles.profileSelectionContainer}>
        <Text style={sharedStyles.title}>Для кого это лекарство?</Text>

        <View style={styles.profilesWrapper}>
          {/* Self profile selection */}
          <Pressable
            style={[
              styles.profileSelectionPressable,
              { borderColor: borderColor, backgroundColor: bGColor },
            ]}
          >
            <View style={[styles.profileSelectionIcon]}>
              <PersonIcon color="#fff" />
            </View>

            <View style={styles.profileSelectionTextWrapper}>
              <Text style={[styles.profileSelectionNameText, { color }]}>
                Для меня
              </Text>
              <Text style={[styles.profileSelectionRelationText, { color }]}>
                Вы
              </Text>
            </View>

            <View style={[styles.profileSelectionCircular]}>
              <View style={[styles.profileSelectionCircularDot]} />
            </View>
          </Pressable>

          {/* other profile selection */}
          <Pressable
            style={[
              styles.profileSelectionPressable,
              { borderColor: borderColor, backgroundColor: bGColor },
            ]}
          >
            <View style={[styles.profileSelectionIcon]}>
              <PersonIcon color="#fff" />
            </View>

            <View style={styles.profileSelectionTextWrapper}>
              <Text style={[styles.profileSelectionNameText, { color }]}>
                Анна
              </Text>
              <Text style={[styles.profileSelectionRelationText, { color }]}>
                Мать
              </Text>
            </View>

            <View style={[styles.profileSelectionCircular]}>
              <View style={[styles.profileSelectionCircularDot]} />
            </View>
          </Pressable>

          {/* <CustomButton
          label="Выбрать члена семьи"
          variant="outline"
          textVaraint="tintText"
          svgIcon={<PlusIcon color={tintColor} size={12} />}
        /> */}

          <CustomButton
            label="Добавить члена семьи"
            variant="outline"
            textVaraint="tintText"
            svgIcon={<PlusIcon color={tintColor} size={12} />}
          />
        </View>
      </View>

      <CustomButton
        label="Далее"
        style={sharedStyles.button}
        variant="disabled"
        textVaraint="mutedText"
        onPress={() => router.navigate("/(tabs)/add-pill/schedule-step")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 32,
  },
  pillFormContainer: {
    gap: 16,
  },
  pillFormWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },
  ghostWrapper: {
    width: 78,
    height: 105,
  },
  pillForm: {
    width: 78,
    height: 105,
    alignItems: "center",
    gap: 8,
  },
  pillFormPressable: {
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 78,
  },
  pillFormName: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    lineHeight: 19.2,
  },
  profileSelectionContainer: {
    width: "100%",
    gap: 16,
  },
  profilesWrapper: {
    gap: 8,
  },
  profileSelectionPressable: {
    width: "100%",
    height: 65,
    paddingLeft: 16,
    paddingRight: 16,
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  profileSelectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8F1FF",
  },
  profileSelectionTextWrapper: {
    gap: 4,
  },
  profileSelectionNameText: {
    fontFamily: "Roboto_500Medium",
    fontSize: 15,
    lineHeight: 17.2,
  },
  profileSelectionRelationText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 14,
    lineHeight: 16.2,
  },
  profileSelectionCircular: {
    width: 20,
    height: 20,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto",
    backgroundColor: "#AEAEB2",
  },
  profileSelectionCircularDot: {
    width: 15,
    height: 15,
    borderRadius: 15,
    backgroundColor: "#fff",
  },
});
