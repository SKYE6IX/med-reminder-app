import { useBottomSheet } from "@/component/bottom-sheet-provider";
import CameraIcon from "@/component/icons/camera-icon";
import UserIcon from "@/component/icons/user-icon";
import AvatarPicker from "@/component/ui/avatar-picker";
import CustomButton from "@/component/ui/custom-button/custom-button";
import CustomPicker from "@/component/ui/custom-picker/custom-picker";
import AndroidDateTimeWrapper, {
  DateTimeWrapperRef,
} from "@/component/ui/date-time-wrapper/date-time-wrapper.android";
import IOSDateTimeWrapper from "@/component/ui/date-time-wrapper/date-time-wrapper.ios";
import FormInput from "@/component/ui/form/form-input";
import Loader from "@/component/ui/loader";
import { QueryKey } from "@/constants/query-keys";

import { useProfileImage } from "@/hooks/use-profile-image";
import { useProfilesQuery } from "@/hooks/use-profiles-query";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useUserQuery } from "@/hooks/use-user-data";
import { useTranslation } from "@/i18next/i18next";
import { useFeedBackStore } from "@/stores/feedback-store";
import { UserResponse } from "@/types/user";
import { api, axios } from "@/utils/axiosInstance";
import { DateTime } from "@/utils/luxonUtil";
import { queryClient } from "@/utils/query-client";
import { useMutation } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useMemo, useRef, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

interface UpdateUserData {
  name: string | null;
  email: string | null;
  dateOfBirth: string | null;
  gender: string | null;
}

const updateUserMutation = async (updateData: UpdateUserData) => {
  const response = await api.put<UserResponse>("users", updateData);
  return response.data;
};

const formatDob = (dob: string, lng: string) => {
  if (!dob) return;

  console.log(dob);
  const formatDob = DateTime.fromFormat(dob, "yyyyMMdd");
  return formatDob.setLocale(lng).toJSDate().toLocaleDateString();
};

export default function UserDetails() {
  const { t, i18n } = useTranslation();
  const isAndroid = Platform.OS === "android";

  const { openSheet, closeSheet } = useBottomSheet();

  const insets = useSafeAreaInsets();
  const androidDateRef = useRef<DateTimeWrapperRef>(null);

  const { showFeedBack } = useFeedBackStore();

  const { user } = useUserQuery();
  const { selfProfile } = useProfilesQuery();
  const profileImageUrl = useProfileImage();

  // Query data
  const [updateUserData, setUpdateUserData] = useState({
    name: user?.name ?? null,
    email: user?.email ?? null,
    dateOfBirth: user?.dateOfBirth ?? null,
    gender: user?.gender ?? null,
  });

  // Track the visibility of the picker for gender selection
  const [isVisible, setIsVisible] = useState(false); // @platform IOS ONLY.

  const canUpdate = useMemo(() => {
    const exisitngData = user;
    const { name, email, dateOfBirth, gender } = updateUserData;
    return (
      name !== exisitngData?.name ||
      email !== exisitngData?.email ||
      dateOfBirth !== exisitngData?.dateOfBirth ||
      gender !== exisitngData?.gender
    );
  }, [updateUserData, user]);

  const dob = formatDob(updateUserData.dateOfBirth ?? "", i18n.language);

  // @platform IOS ONLY
  // Trigger gender picker
  const handleTriggerPicker = () => {
    setIsVisible(!isVisible);
    // Set a default on picked
    if (!updateUserData.gender) {
      setUpdateUserData((prv) => ({ ...prv, gender: genderList[0].value }));
    }
  };

  // Callback function for onValueSelected on gender picker.
  const handleOnGenderValueSelected = (selectedValue: string) => {
    setUpdateUserData((prv) => ({ ...prv, gender: selectedValue }));
  };

  const setDob = (date: Date) => {
    const toISODate = DateTime.fromJSDate(date).toISODate({ format: "basic" });
    setUpdateUserData((prv) => ({ ...prv, dateOfBirth: toISODate }));
  };

  // @Platform ANDROID ONLY
  const handleOnDateChange = (date: Date) => {
    if (isAndroid) {
      setDob(date);
    }
  };

  // @Platform IOS ONLY
  const handleAppyDate = (date: Date) => {
    setDob(date);
    closeSheet();
  };

  const handleOnTextInputChange = ({ name, value }: { name: string; value: string }) => {
    setUpdateUserData((prvState) => ({ ...prvState, [name]: value }));
  };

  const { isPending, mutate } = useMutation({
    mutationFn: updateUserMutation,
    onSuccess(data) {
      queryClient.setQueryData([QueryKey.users], data);
      showFeedBack({
        title: t("feedback.success.user_data.title"),
        message: t("feedback.success.user_data.text"),
        status: "success",
      });
    },
    onError(error) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ERR_NETWORK") {
          showFeedBack({
            title: t("feedback.error.network.title"),
            message: t("feedback.error.network.text"),
            status: "error",
          });
        } else {
          showFeedBack({
            title: t("feedback.error.general.title"),
            message: t("feedback.error.general.text"),
            status: "error",
          });
        }
      }
    },
  });

  const handleUpdateUser = () => {
    // We only send updated data that isn't the same as
    // the exising one;
    const { name, email, dateOfBirth, gender } = updateUserData;
    const data: UpdateUserData = {
      name: name !== user?.name ? name : null,
      email: email !== user?.email ? email : null,
      dateOfBirth: dateOfBirth !== user?.dateOfBirth ? dateOfBirth : null,
      gender: gender !== user?.gender ? gender : null,
    };
    mutate(data);
  };

  const snapPoint = isAndroid ? "60%" : "55%";
  const openAvatarPickerSheet = () => {
    openSheet({
      title: t("settings_screen.user_details_sheet_title"),
      snapPointPercent: snapPoint,
      content: <AvatarPicker profileId={selfProfile?.id ?? ""} onActionComplete={closeSheet} />,
    });
  };

  const openDatePicker = () => {
    if (isAndroid) {
      androidDateRef.current?.showDateTime();
    } else {
      openSheet({
        title: t("settings_screen.user_details_dob_label"),
        snapPointPercent: "55%",
        content: (
          <IOSDateTimeWrapper
            mode="date"
            onDateTimeChange={() => {}}
            disabledDate={false}
            applyChange={handleAppyDate}
          />
        ),
      });
    }
  };

  // Themes color
  const color = useThemeColor({}, "textPrimary");
  const mutedColor = useThemeColor({}, "textMuted");
  const tintColor = useThemeColor({}, "tint");
  const bgPrimary = useThemeColor({}, "backgroundPrimary");
  const bgTertiary = useThemeColor({}, "backgroundTertiary");
  const bgSecondary = useThemeColor({}, "backgroundSecondary");
  const borderColor = useThemeColor({}, "borderColor");

  const top = isAndroid ? insets.top + 20 : 0;

  const genderList = [
    { label: t("settings_screen.user_details_gender_male"), value: "MALE" },
    { label: t("settings_screen.user_details_gender_female"), value: "FEMALE" },
  ];

  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: bgPrimary, paddingTop: top }]}
      edges={["top"]}
    >
      <ScrollView contentContainerStyle={styles.contentStyle}>
        <Loader visible={isPending} />
        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            <Image source={profileImageUrl} style={styles.avatar} />
            <Pressable
              style={[styles.cameraIcon, { backgroundColor: bgTertiary }]}
              onPress={openAvatarPickerSheet}
            >
              <CameraIcon color={tintColor} />
            </Pressable>
          </View>
        </View>

        <View style={styles.body}>
          <FormInput
            label={t("settings_screen.user_details_name_label")}
            placeholder=""
            type="text"
            name="name"
            hasError={false}
            defaultState={updateUserData.name ?? ""}
            onValueChange={handleOnTextInputChange}
          />

          <FormInput
            label={t("settings_screen.user_details_email_label")}
            placeholder={user?.email}
            type="email"
            name="email"
            hasError={false}
            defaultState={updateUserData.email ?? ""}
            onValueChange={handleOnTextInputChange}
          />

          {/* DATE OF BIRTH */}
          <View style={styles.bodyItem}>
            <Text style={[styles.bodyItemLabel, { color }]}>
              {t("settings_screen.user_details_dob_label")}
            </Text>
            <Pressable
              style={[styles.bodyItemPressable, { backgroundColor: bgSecondary, borderColor }]}
              onPress={openDatePicker}
            >
              <Text style={[styles.bodyItemValue, { color: mutedColor }]}>
                {dob || t("settings_screen.user_details_dob_placeholder")}
              </Text>
            </Pressable>

            {/* ONLY FOR ANDROID */}
            {isAndroid && (
              <AndroidDateTimeWrapper
                ref={androidDateRef}
                onDateTimeChange={handleOnDateChange}
                mode="date"
              />
            )}
          </View>

          {/* GENDER */}
          <View style={[styles.bodyItem, { borderWidth: 1, borderRadius: 16, borderColor }]}>
            <CustomPicker
              label={t("settings_screen.user_details_gender_label")}
              items={genderList}
              selectedValue={updateUserData.gender ?? ""}
              onValueSelected={handleOnGenderValueSelected}
              triggerSelection={handleTriggerPicker}
              isSelectionVisible={isVisible}
              svgIcon={<UserIcon color={color} />}
            />
          </View>
        </View>

        <CustomButton
          label={t("common.save")}
          style={styles.button}
          disabled={!canUpdate}
          variant={canUpdate ? "filled" : "disabled"}
          textVaraint={canUpdate ? "regularText" : "mutedText"}
          onPress={handleUpdateUser}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentStyle: {
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
    borderRadius: 999,
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
