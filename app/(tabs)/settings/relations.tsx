import DeleteIcon from "@/component/icons/delete-icon";
import PlusIcon from "@/component/icons/plus-icon";
import AddProfile from "@/component/ui/add-profile";
import BottomSheetWrapper, { BottomSheetWrapperRef } from "@/component/ui/bottom-sheet-wrapper";
import CustomButton from "@/component/ui/custom-button/custom-button";
import Loader from "@/component/ui/loader";
import { useProfilesQuery } from "@/hooks/use-profiles-query";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useFeedBackStore } from "@/stores/feedback-store";
import { ProfileResponse } from "@/types/user";
import { api, axios } from "@/utils/axiosInstance";
import { queryClient } from "@/utils/query-client";
import { useMutation } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const deleteRelationProfileMutation = async (profileId: string) => {
  await api.delete(`users/profiles/${profileId}`);
};

export default function Relations() {
  const { showFeedBack } = useFeedBackStore();
  const { profiles } = useProfilesQuery();

  const [profileId, setProfileId] = useState("");
  const addProfileBottomSheetRef = useRef<BottomSheetWrapperRef>(null);
  const deleteProfileBottomSheetRef = useRef<BottomSheetWrapperRef>(null);

  const isIOS = Platform.OS === "ios";
  const insets = useSafeAreaInsets();

  const relationsProfile = profiles?.filter((profile) => !profile.isSelf) ?? [];

  //   Themes color
  const color = useThemeColor({}, "textPrimary");
  const mutedColor = useThemeColor({}, "textMuted");
  const bgPrimary = useThemeColor({}, "backgroundPrimary");
  const bgSecondary = useThemeColor({}, "backgroundSecondary");
  const bgTertiary = useThemeColor({}, "backgroundTertiary");
  const borderColor = useThemeColor({}, "borderColor");

  const openDeleteBottomSheet = (id: string) => {
    setProfileId(id);
    deleteProfileBottomSheetRef.current?.open();
  };

  const { isPending, mutate } = useMutation({
    mutationFn: deleteRelationProfileMutation,
    onSuccess(data, variables) {
      queryClient.setQueryData(["profiles"], (existingData: ProfileResponse[]) =>
        existingData.filter((profile) => profile.id !== variables),
      );
      deleteProfileBottomSheetRef.current?.close();
    },
    onError(error) {
      if (axios.isAxiosError(error)) {
        console.log("An axios error occur when creating relatiion profile -> ", error);
      } else {
        console.log("An unknown error occur when creating relatiion profile -> ", error);
      }
      showFeedBack({
        title: "Ошибка!",
        message: "Что-то пошло не так. Пожалуйста, попробуйте еще раз!",
        status: "error",
      });
      deleteProfileBottomSheetRef.current?.close();
    },
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgPrimary }]}>
      <View style={[styles.container, { paddingTop: isIOS ? insets.top : insets.top + 10 }]}>
        <View style={[styles.contentCotainer, { backgroundColor: bgSecondary, borderColor }]}>
          {/* PROFILE LIST */}
          {relationsProfile.map((profile, i) => (
            <View
              key={profile.id}
              style={[
                styles.contentItemWrapper,
                { borderTopWidth: i !== 0 ? 1 : undefined, borderColor },
              ]}
            >
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
                onPress={() => openDeleteBottomSheet(profile.id)}
              >
                <DeleteIcon />
              </Pressable>
            </View>
          ))}

          {/* ADD NEW PROFILE */}
          <Pressable
            style={[
              styles.contentItemWrapper,
              { borderTopWidth: relationsProfile.length ? 1 : undefined, borderColor },
            ]}
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

      {/* Delete Prfoile Bottom Sheet */}
      <BottomSheetWrapper
        ref={deleteProfileBottomSheetRef}
        title="Удалить пользователя?"
        snapPointPercent="30%"
      >
        <View style={styles.deleteActionBox}>
          <Text style={[styles.deletActionText, { color: mutedColor }]}>
            Все данные, связанные с этим пользователем, будут удалены.
          </Text>
          <View style={styles.deleActionBtnWrapper}>
            <CustomButton
              label="Отмена"
              variant="outline"
              textVaraint="mutedText"
              style={styles.deleteActionBtn}
              onPress={() => deleteProfileBottomSheetRef.current?.close()}
            />
            <CustomButton
              label="Удалить"
              variant="danger"
              style={styles.deleteActionBtn}
              onPress={() => mutate(profileId)}
            />
          </View>
        </View>
      </BottomSheetWrapper>

      {/* Loader */}
      <Loader visible={isPending} />
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

  deleteActionBox: {
    gap: 16,
    alignItems: "center",
  },
  deletActionText: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    lineHeight: 19.2,
    width: 360,
    textAlign: "center",
  },
  deleActionBtnWrapper: {
    flexDirection: "row",
    gap: 16,
  },
  deleteActionBtn: {
    width: "47%",
  },
});
