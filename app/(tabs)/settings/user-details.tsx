import CameraIcon from "@/component/icons/camera-icon";
import UserIcon from "@/component/icons/user-icon";
import CustomButton from "@/component/ui/custom-button/custom-button";
import CustomPicker from "@/component/ui/custom-picker/custom-picker";
import DateTimeWrapper, {
  DateTimeWrapperRef,
} from "@/component/ui/date-time-wrapper/date-time-wrapper";
import FormInput from "@/component/ui/form/form-input";
import Loader from "@/component/ui/loader";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useUserData } from "@/hooks/use-user-data";
import { useFeedBackStore } from "@/stores/feedback-store";
import { UserResponse } from "@/types/user";
import { api, axios } from "@/utils/axiosInstance";
import { queryClient } from "@/utils/query-client";
import { useMutation } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useMemo, useRef, useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const genderList = [
  { label: "Мужской", value: "MALE" },
  { label: "Женский", value: "FEMALE" },
];

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

export default function UserDetails() {
  const { showFeedBack } = useFeedBackStore();
  const { user } = useUserData();

  const isIOS = Platform.OS === "ios";
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();

  const [updateUserData, setUpdateUserData] = useState({
    name: user?.name ?? null,
    email: user?.email ?? null,
    dateOfBirth: user?.dateOfBirth ?? null,
    gender: user?.gender ?? null,
  });

  const datePickerRef = useRef<DateTimeWrapperRef>(null);

  // @platform IOS ONLY.
  // Track the visibility of the picker for gender selection
  const [isVisible, setIsVisible] = useState(false);

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

  // Callback function for onValueSelected on date picker
  const handleOnDateTimeSelected = (date: Date) => {
    setUpdateUserData((prv) => ({ ...prv, dateOfBirth: date.toLocaleDateString("ru") }));
  };

  const handleOnTextInputChange = ({ name, value }: { name: string; value: string }) => {
    setUpdateUserData((prvState) => ({ ...prvState, [name]: value }));
  };

  const { isPending, mutate } = useMutation({
    mutationFn: updateUserMutation,
    onSuccess(data) {
      queryClient.setQueryData(["users"], data);
      showFeedBack({
        title: "Успех!",
        message: "Данные обновлены!",
        status: "success",
      });
    },
    onError(error) {
      if (axios.isAxiosError(error)) {
        console.log("An axios error occur when update user -> ", error);
      } else {
        console.log("An unknown error occur when update user -> ", error);
      }
      showFeedBack({
        title: "Ошибка!",
        message: "Что-то пошло не так! Пожалуйста, попробуйте еще раз.",
        status: "error",
      });
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

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bgPrimary }]} edges={["top"]}>
      <ScrollView style={{ flex: 1 }}>
        <Loader visible={isPending} />
        <View style={[styles.container, { paddingTop: isIOS ? undefined : insets.top + 10 }]}>
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
              placeholder=""
              type="text"
              name="name"
              hasError={false}
              defaultValue={updateUserData.name ?? ""}
              onValueChange={handleOnTextInputChange}
            />

            <FormInput
              label="Почта"
              placeholder={user?.email}
              type="email"
              name="email"
              hasError={false}
              defaultValue={updateUserData.email ?? ""}
              onValueChange={handleOnTextInputChange}
            />

            {/* DATE OF BIRTH */}
            <View style={styles.bodyItem}>
              <Text style={[styles.bodyItemLabel, { color }]}>Дата рождения</Text>
              <Pressable
                style={[styles.bodyItemPressable, { backgroundColor: bgSecondary, borderColor }]}
                onPress={() => datePickerRef.current?.showDateTime()}
              >
                <Text style={[styles.bodyItemValue, { color: mutedColor }]}>
                  {updateUserData.dateOfBirth || "Введите дату Вашего рождения"}
                </Text>
              </Pressable>
              {/* handleSetTime(date, event) */}
              <DateTimeWrapper
                onDateTimeSelected={handleOnDateTimeSelected}
                ref={datePickerRef}
                mode="date"
                bottomSheetTitle="Дата рождения"
                showUpdateButton={false}
                disabledDate={false}
              />
            </View>

            {/* GENDER */}
            <View style={[styles.bodyItem, { borderWidth: 1, borderRadius: 16, borderColor }]}>
              <CustomPicker
                label="Пол"
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
            label="Сохранить"
            style={styles.button}
            disabled={!canUpdate}
            variant={canUpdate ? "filled" : "disabled"}
            textVaraint={canUpdate ? "regularText" : "mutedText"}
            onPress={handleUpdateUser}
          />
        </View>
      </ScrollView>
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
