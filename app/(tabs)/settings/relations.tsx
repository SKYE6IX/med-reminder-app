import CameraIcon from "@/component/icons/camera-icon";
import DeleteIcon from "@/component/icons/delete-icon";
import PlusIcon from "@/component/icons/plus-icon";
import AddProfile from "@/component/ui/add-profile";
import AvatarPicker from "@/component/ui/avatar-picker";
import BottomSheetWrapper, { BottomSheetWrapperRef } from "@/component/ui/bottom-sheet-wrapper";
import CustomButton from "@/component/ui/custom-button/custom-button";
import Loader from "@/component/ui/loader";
import SubscriptionOfferBanner, {
  SubscriptionOfferBannerRef,
} from "@/component/ui/subscription-offer-banner";
import { useProfileImage } from "@/hooks/use-profile-image";
import { useProfilesQuery } from "@/hooks/use-profiles-query";
import { useSubscriptionPlanQuery } from "@/hooks/use-subscription-plan-query";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useFeedBackStore } from "@/stores/feedback-store";
import { ProfileResponse } from "@/types/user";
import { api, axios } from "@/utils/axiosInstance";
import { queryClient } from "@/utils/query-client";
import { useMutation } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const deleteRelationProfileMutation = async (profileId: string) => {
  await api.delete(`users/profiles/${profileId}`);
};

export default function Relations() {
  const openBannerRef = useRef<SubscriptionOfferBannerRef>(null);

  const { showFeedBack } = useFeedBackStore();
  const { relationProfiles } = useProfilesQuery();
  const { isPremiumPlan } = useSubscriptionPlanQuery();

  const [profileId, setProfileId] = useState("");
  const addProfileBottomSheetRef = useRef<BottomSheetWrapperRef>(null);
  const deleteProfileBottomSheetRef = useRef<BottomSheetWrapperRef>(null);
  const insets = useSafeAreaInsets();

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

  const handleOpenAddProfile = () => {
    if (isPremiumPlan) {
      addProfileBottomSheetRef.current?.open();
    } else {
      openBannerRef.current?.toggleBanner();
    }
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
      <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
        <View style={[styles.contentCotainer, { backgroundColor: bgSecondary, borderColor }]}>
          {/* PROFILE LIST */}
          {relationProfiles.map((profile, i) => (
            <RelationProfile
              key={profile.id}
              profile={profile}
              index={i}
              openDeleteBottomSheet={openDeleteBottomSheet}
            />
          ))}

          {/* ADD NEW PROFILE */}
          <Pressable
            style={[
              styles.contentItemWrapper,
              { borderTopWidth: relationProfiles.length ? 1 : undefined, borderColor },
            ]}
            onPress={handleOpenAddProfile}
          >
            <View style={[styles.profileImage, { backgroundColor: bgTertiary }]}>
              <PlusIcon color={color} size={15} />
            </View>
            <Text style={[styles.label, { color }]}>Добавить члена семьи</Text>
          </Pressable>
        </View>
      </View>

      {/* Subscription Banner */}
      <SubscriptionOfferBanner ref={openBannerRef} />

      {/* Add new profile Bottom sheet */}
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

const RelationProfile = ({
  profile,
  index,
  openDeleteBottomSheet,
}: {
  profile: ProfileResponse;
  index: number;
  openDeleteBottomSheet: (id: string) => void;
}) => {
  const profileImageUrl = useProfileImage(profile.id);
  const addProfileImage = useRef<BottomSheetWrapperRef>(null);
  //   Themes color
  const color = useThemeColor({}, "textPrimary");
  const bgTertiary = useThemeColor({}, "backgroundTertiary");
  const borderColor = useThemeColor({}, "borderColor");
  return (
    <>
      <View
        key={profile.id}
        style={[
          styles.contentItemWrapper,
          { borderTopWidth: index !== 0 ? 1 : undefined, borderColor },
        ]}
      >
        <Pressable style={styles.profileImage} onPress={() => addProfileImage.current?.open()}>
          <Image
            source={profileImageUrl}
            style={styles.relationAvatar}
            contentPosition="top center"
          />

          <View style={styles.cameraIcon}>
            <CameraIcon />
          </View>
        </Pressable>
        <Text style={[styles.label, { color }]}>{profile.name}</Text>
        <Pressable
          style={[styles.profileImage, { backgroundColor: bgTertiary, marginLeft: "auto" }]}
          onPress={() => openDeleteBottomSheet(profile.id)}
        >
          <DeleteIcon color={color} />
        </Pressable>
      </View>

      {/* AVATAR PICKER */}
      <AvatarPicker bottomSheetWrapperRef={addProfileImage} profileId={profile.id} />
    </>
  );
};

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
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraIcon: {
    position: "absolute",
    bottom: -3,
    right: -3,
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
