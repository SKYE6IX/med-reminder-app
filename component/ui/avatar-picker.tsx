import { useThemeColor } from "@/hooks/use-theme-color";
import { useFeedBackStore } from "@/stores/feedback-store";
import { useUserStore } from "@/stores/use-user-store";
import { ProfileResponse } from "@/types/user";
import { api, axios } from "@/utils/axiosInstance";
import { queryClient } from "@/utils/query-client";
import { useMutation } from "@tanstack/react-query";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { RefObject, useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import CameraIcon from "../icons/camera-icon";
import BottomSheetWrapper, { BottomSheetWrapperRef } from "./bottom-sheet-wrapper";
import CustomButton from "./custom-button/custom-button";
import Loader from "./loader";

const avatarList = [
  { key: "avatar-1", url: require("@/assets/images/avatars/avatar-1.png") },
  { key: "avatar-2", url: require("@/assets/images/avatars/avatar-2.png") },
  { key: "avatar-3", url: require("@/assets/images/avatars/avatar-3.png") },
  { key: "avatar-4", url: require("@/assets/images/avatars/avatar-4.png") },
  { key: "avatar-5", url: require("@/assets/images/avatars/avatar-5.png") },
  { key: "avatar-6", url: require("@/assets/images/avatars/avatar-6.png") },
  { key: "avatar-7", url: require("@/assets/images/avatars/avatar-7.png") },
  { key: "avatar-8", url: require("@/assets/images/avatars/avatar-8.png") },
  { key: "avatar-9", url: require("@/assets/images/avatars/avatar-9.png") },
  { key: "avatar-10", url: require("@/assets/images/avatars/avatar-10.png") },
  { key: "avatar-11", url: require("@/assets/images/avatars/avatar-11.png") },
];

type AvatarPickerProps = {
  profileId: string;
  bottomSheetWrapperRef: RefObject<BottomSheetWrapperRef | null>;
};

interface PickerState {
  key: string | null;
  imageAvatar: string | null;
  emojiAvatar: string | null;
  asset: ImagePicker.ImagePickerAsset | null;
}

interface UploadReqeust {
  asset: ImagePicker.ImagePickerAsset | null;
  profileId: string;
}

const SPACING = 16;
const ITEM_PER_ROW = 4;

const uploadImageMutation = async (uploadRequest: UploadReqeust) => {
  const formData = new FormData();

  formData.append("file", {
    uri: uploadRequest.asset?.uri,
    name: uploadRequest.asset?.fileName,
    type: uploadRequest.asset?.mimeType ?? "image/jpeg",
  } as any);

  formData.append("profileId", uploadRequest.profileId);
  const response = await api.post<{ url: string }>("users/profiles/images", formData);
  return response.data;
};

export default function AvatarPicker({ bottomSheetWrapperRef, profileId }: AvatarPickerProps) {
  const { showFeedBack } = useFeedBackStore();
  const { addEmojiAvatar, removeEmojiAvatar } = useUserStore();
  const [listWidth, setListWidth] = useState(0);

  const [pickerState, setPickerState] = useState<PickerState>({
    key: null,
    imageAvatar: null,
    emojiAvatar: null,
    asset: null,
  });

  const avatarItemSize = (listWidth - SPACING * 2) / ITEM_PER_ROW;

  // Themes color
  const tintColor = useThemeColor({}, "tint");
  const bgTertiary = useThemeColor({}, "backgroundTertiary");

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Требуется разрешение, требуется разрешение на доступ к медиабиблиотеке.");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPickerState((prv) => ({
        ...prv,
        key: "image-avatar",
        imageAvatar: result.assets[0].uri,
        asset: result.assets[0],
        emojiAvatar: null,
      }));
    }
  };

  const { isPending, mutate } = useMutation({
    mutationFn: uploadImageMutation,
    onSuccess(data, variables) {
      queryClient.setQueryData(["profiles"], (existingData: ProfileResponse[]) =>
        existingData.map((profile) => {
          if (profile.id === variables.profileId) {
            return {
              ...profile,
              imageUrl: data.url,
            };
          }
        }),
      );
      removeEmojiAvatar(variables.profileId);
      bottomSheetWrapperRef.current?.close();
    },
    onError(error) {
      if (axios.isAxiosError(error)) {
        console.log("An axios error occur when uploading image -> ", error);
      } else {
        console.log("An unknown error occur when uploading image  -> ", error);
      }
      showFeedBack({
        title: "Ошибка!",
        message: "Что-то пошло не так. Пожалуйста, попробуйте снова.",
        status: "error",
      });
    },
  });

  const saveChoosenAvatar = async () => {
    // We save emoji image to local storage
    if (pickerState.emojiAvatar) {
      addEmojiAvatar(profileId, pickerState.emojiAvatar);
      bottomSheetWrapperRef.current?.close();

      // When user decided to use emoji image
      // we silently delete the image from object and update
      // DB
      await api.delete(`users/profiles/images/${profileId}`);

      // Image avatar upload
    } else if (pickerState.imageAvatar) {
      mutate({ asset: pickerState.asset, profileId });
    }
  };

  return (
    <BottomSheetWrapper
      ref={bottomSheetWrapperRef}
      title="Выберите фотографию"
      snapPointPercent="57%"
    >
      <View style={styles.container}>
        <Loader visible={isPending} />
        <View
          style={styles.avatarList}
          onLayout={(event) => {
            setListWidth(event.nativeEvent.layout.width);
          }}
        >
          <Pressable
            style={[
              styles.avatarItem,
              {
                backgroundColor: bgTertiary,
                width: avatarItemSize,
                height: avatarItemSize,
                borderWidth: "image-avatar" === pickerState.key ? 2 : 0,
                borderColor: tintColor,
              },
            ]}
            onPress={pickImage}
          >
            {pickerState.imageAvatar ? (
              <Image source={pickerState.imageAvatar} contentFit="cover" style={styles.image} />
            ) : (
              <CameraIcon color={tintColor} size={30} />
            )}
          </Pressable>

          {avatarList.map((avatar) => (
            <Pressable
              key={avatar.key}
              style={[
                styles.avatarItem,
                {
                  backgroundColor: bgTertiary,
                  width: avatarItemSize,
                  height: avatarItemSize,
                  borderWidth: avatar.key === pickerState.key ? 2 : 0,
                  borderColor: tintColor,
                },
              ]}
              onPress={() => {
                setPickerState((prv) => ({
                  ...prv,
                  key: avatar.key,
                  emojiAvatar: avatar.url,
                  imageAvatar: null,
                }));
              }}
            >
              <Image source={avatar.url} contentFit="cover" style={styles.image} />
            </Pressable>
          ))}
        </View>

        <CustomButton label="Сохранить" onPress={saveChoosenAvatar} />
      </View>
    </BottomSheetWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  avatarList: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    rowGap: SPACING,
  },
  avatarItem: {
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    flex: 1,
    width: "100%",
    borderRadius: 999,
  },
});
