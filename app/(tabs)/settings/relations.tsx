import { useBottomSheet } from "@/component/bottom-sheet-provider";
import CameraIcon from "@/component/icons/camera-icon";
import DeleteIcon from "@/component/icons/delete-icon";
import PlusIcon from "@/component/icons/plus-icon";
import AddProfile from "@/component/ui/add-profile";
import AvatarPicker from "@/component/ui/avatar-picker";
import CustomButton from "@/component/ui/custom-button/custom-button";
import Loader from "@/component/ui/loader";
import SubscriptionBanner, { SubscriptionBannerRef } from "@/component/ui/subscription-banner";
import { useProfileImage } from "@/hooks/use-profile-image";
import { useProfilesQuery } from "@/hooks/use-profiles-query";
import { useSubscriptionPlanQuery } from "@/hooks/use-subscription-plan-query";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useFeedBackStore } from "@/stores/feedback-store";
import { ProfileResponse } from "@/types/user";
import { api } from "@/utils/axiosInstance";
import { queryClient } from "@/utils/query-client";
import { useMutation } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

interface RelationProfileProps {
  profile: ProfileResponse;
  index: number;
  openDeleteBottomSheet: (id: string) => void;
}

interface DeleteRelationProfileProps {
  color: string;
  deleteFn: () => void;
  closeSheet: () => void;
}

const deleteRelationProfileMutation = async (profileId: string) => {
  await api.delete(`users/profiles/${profileId}`);
};

export default function Relations() {
  const isAndroid = Platform.OS === "android";

  const insets = useSafeAreaInsets();
  const openBannerRef = useRef<SubscriptionBannerRef>(null);

  const { openSheet, closeSheet } = useBottomSheet();

  const { showFeedBack } = useFeedBackStore();
  const { relationProfiles } = useProfilesQuery();
  const { isPremiumPlan } = useSubscriptionPlanQuery();

  const [profileId, setProfileId] = useState("");

  const { isPending, mutate } = useMutation({
    mutationFn: deleteRelationProfileMutation,
    onSuccess(data, variables) {
      queryClient.setQueryData(["profiles"], (existingData: ProfileResponse[]) =>
        existingData.filter((profile) => profile.id !== variables),
      );
      closeSheet();
    },

    onError(error) {
      showFeedBack({
        title: "Ошибка!",
        message: "Что-то пошло не так. Пожалуйста, попробуйте еще раз!",
        status: "error",
      });
      closeSheet();
    },
  });

  const openAddNewProfileSheet = () => {
    if (isPremiumPlan) {
      openSheet({
        title: "Добавить члена семьи",
        content: <AddProfile onProfileAdded={closeSheet} />,
      });
    } else {
      openBannerRef.current?.openModal();
    }
  };

  const snapPoint = isAndroid ? "35%" : "30%";
  const openDeleteProfileSheet = (id: string) => {
    setProfileId(id);
    openSheet({
      title: "Удалить пользователя?",
      snapPointPercent: snapPoint,
      content: (
        <DeleteRelationProfile
          color={mutedColor}
          deleteFn={() => mutate(profileId)}
          closeSheet={closeSheet}
        />
      ),
    });
  };

  //   Themes color
  const color = useThemeColor({}, "textPrimary");
  const mutedColor = useThemeColor({}, "textMuted");
  const bgPrimary = useThemeColor({}, "backgroundPrimary");
  const bgSecondary = useThemeColor({}, "backgroundSecondary");
  const bgTertiary = useThemeColor({}, "backgroundTertiary");
  const borderColor = useThemeColor({}, "borderColor");

  const top = isAndroid ? insets.top + 20 : insets.top + 10;
  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: bgPrimary, paddingTop: top }]}>
      <Loader visible={isPending} />
      <View style={styles.container}>
        <View style={[styles.contentCotainer, { backgroundColor: bgSecondary, borderColor }]}>
          {/* PROFILE LIST */}
          {relationProfiles.map((profile, i) => (
            <RelationProfile
              key={profile.id}
              profile={profile}
              index={i}
              openDeleteBottomSheet={openDeleteProfileSheet}
            />
          ))}
          {/* ADD NEW PROFILE */}
          <Pressable
            style={[
              styles.contentItemWrapper,
              { borderTopWidth: relationProfiles.length ? 1 : undefined, borderColor },
            ]}
            onPress={openAddNewProfileSheet}
          >
            <View style={[styles.profileImage, { backgroundColor: bgTertiary }]}>
              <PlusIcon color={color} size={15} />
            </View>
            <Text style={[styles.label, { color }]}>Добавить члена семьи</Text>
          </Pressable>
        </View>
      </View>
      <SubscriptionBanner ref={openBannerRef} />
    </SafeAreaView>
  );
}

const RelationProfile = ({ profile, index, openDeleteBottomSheet }: RelationProfileProps) => {
  const profileImageUrl = useProfileImage(profile.id);
  const { openSheet, closeSheet } = useBottomSheet();

  //   Themes color
  const color = useThemeColor({}, "textPrimary");
  const bgTertiary = useThemeColor({}, "backgroundTertiary");
  const borderColor = useThemeColor({}, "borderColor");

  const snapPoint = Platform.OS === "android" ? "60%" : "55%";
  const openAvatarPickerSheet = () => {
    openSheet({
      title: "Выберите фотографию",
      snapPointPercent: snapPoint,
      content: <AvatarPicker profileId={profile.id} onActionComplete={closeSheet} />,
    });
  };

  return (
    <>
      <View
        key={profile.id}
        style={[
          styles.contentItemWrapper,
          { borderTopWidth: index !== 0 ? 1 : undefined, borderColor },
        ]}
      >
        <Pressable style={styles.profileImage} onPress={openAvatarPickerSheet}>
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
    </>
  );
};

const DeleteRelationProfile = ({ color, closeSheet, deleteFn }: DeleteRelationProfileProps) => {
  return (
    <View style={styles.deleteActionBox}>
      <Text style={[styles.deletActionText, { color }]}>
        Все данные, связанные с этим пользователем, будут удалены.
      </Text>

      <View style={styles.deleActionBtnWrapper}>
        <CustomButton
          label="Отмена"
          variant="outline"
          textVaraint="tintText"
          style={styles.deleteActionBtn}
          onPress={closeSheet}
        />
        <CustomButton
          label="Удалить"
          variant="danger"
          style={styles.deleteActionBtn}
          onPress={deleteFn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    borderRadius: 999,
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
