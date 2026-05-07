import DeleteIcon from "@/component/icons/delete-icon";
import PlusIcon from "@/component/icons/plus-icon";
import AddProfile from "@/component/ui/add-profile";
import { BottomSheetWrapperRef } from "@/component/ui/bottom-sheet-wrapper";
import { useProfilesQuery } from "@/hooks/use-profiles-query";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Image } from "expo-image";
import { useRef } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function Relations() {
  const { profiles } = useProfilesQuery();

  const addProfileBottomSheetRef = useRef<BottomSheetWrapperRef>(null);

  const isIOS = Platform.OS === "ios";
  const insets = useSafeAreaInsets();

  const relationsProfile = profiles?.filter((profile) => !profile.isSelf) ?? [];

  //   Themes color
  const color = useThemeColor({}, "textPrimary");
  const bgPrimary = useThemeColor({}, "backgroundPrimary");
  const bgSecondary = useThemeColor({}, "backgroundSecondary");
  const bgTertiary = useThemeColor({}, "backgroundTertiary");
  const borderColor = useThemeColor({}, "borderColor");

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgPrimary }]}>
      <View style={[styles.container, { paddingTop: isIOS ? insets.top : insets.top + 10 }]}>
        <View style={[styles.contentCotainer, { backgroundColor: bgSecondary, borderColor }]}>
          {/* PROFILE LIST */}
          {relationsProfile.map((profile) => (
            <View key={profile.id} style={styles.contentItemWrapper}>
              <View style={styles.circle}>
                <Image
                  source={require("@/assets/mock-profile-2.jpg")}
                  style={styles.relationAvatar}
                  contentPosition="top center"
                />
              </View>
              <Text style={[styles.label, { color }]}>{profile.name}</Text>
              <Pressable
                style={[styles.circle, { backgroundColor: bgTertiary, marginLeft: "auto" }]}
              >
                <DeleteIcon />
              </Pressable>
            </View>
          ))}

          {/* ADD NEW PROFILE */}
          <Pressable
            style={styles.contentItemWrapper}
            onPress={() => addProfileBottomSheetRef.current?.open()}
          >
            <View style={[styles.circle, { backgroundColor: bgTertiary }]}>
              <PlusIcon color={color} size={15} />
            </View>
            <Text style={[styles.label, { color }]}>Добавить члена семьи</Text>
          </Pressable>
        </View>
      </View>
      <AddProfile ref={addProfileBottomSheetRef} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  contentCotainer: {
    borderWidth: 1,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 16,
    gap: 8,
  },
  contentItemWrapper: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  label: {
    fontFamily: "Roboto_500Medium",
    fontSize: 14,
    lineHeight: 16.2,
  },
  relationAvatar: {
    width: "100%",
    height: "100%",
  },
});
