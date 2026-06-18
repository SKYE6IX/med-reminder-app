import { useThemeColor } from "@/hooks/use-theme-color";
import { useAppSettingsStore } from "@/stores/app-settings-store";
import { useFeedBackStore } from "@/stores/feedback-store";
import { useNotificationDataStore } from "@/stores/notification-data-store";
import { useAuthStore } from "@/stores/use-auth-store";
import { useUserStore } from "@/stores/use-user-store";
import { api, axios } from "@/utils/axiosInstance";
import { queryClient } from "@/utils/query-client";
import { clearTokens } from "@/utils/tokenUtils";
import { useMutation } from "@tanstack/react-query";
import { RefObject } from "react";
import { StyleSheet, Text, View } from "react-native";
import BottomSheetWrapper, { BottomSheetWrapperRef } from "../bottom-sheet-wrapper";
import CustomButton from "../custom-button/custom-button";
import Loader from "../loader";

type DeleteAccountSheetProps = {
  bottomSheetRef: RefObject<BottomSheetWrapperRef | null>;
};

const deleteAccountMutation = async () => {
  await api.delete("users");
};

export default function DeleteAccountSheet({ bottomSheetRef }: DeleteAccountSheetProps) {
  const { showFeedBack } = useFeedBackStore();

  const { isPending, mutate } = useMutation({
    mutationFn: deleteAccountMutation,
    onSuccess() {
      // Reset ALL
      useUserStore.getState().resetUserData();
      useNotificationDataStore.getState().clearScheduleData();
      useAppSettingsStore.getState().resetAppSetting();
      useAuthStore.getState().resetOnaboarding();
      clearTokens();
      queryClient.clear();
      useAuthStore.getState().setIsAuthenticated(false);
    },
    onError(error) {
      if (axios.isAxiosError(error)) {
        console.log("An axios error occur when delete account! -> ", error);
      } else {
        console.log("An axios error occur when delete account! -> ", error);
      }
      showFeedBack({
        title: "Ошибка!",
        message: "Что-то пошло не так. Пожалуйста, попробуйте еще раз!",
        status: "error",
      });
    },
  });

  const mutedColor = useThemeColor({}, "textMuted");

  return (
    <BottomSheetWrapper ref={bottomSheetRef} title="Удалить аккаунт?" snapPointPercent="30%">
      <Loader visible={isPending} />
      <View style={styles.container}>
        <Text style={[styles.text, { color: mutedColor }]}>
          Все данные, связанные с этим пользователем, будут удалены.
        </Text>
        <View style={styles.buttonWrapper}>
          <CustomButton
            label="Отмена"
            variant="outline"
            textVaraint="mutedText"
            style={styles.button}
            onPress={() => bottomSheetRef.current?.close()}
          />
          <CustomButton
            label="Удалить"
            variant="danger"
            style={styles.button}
            onPress={() => mutate()}
          />
        </View>
      </View>
    </BottomSheetWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    alignItems: "center",
  },
  text: {
    fontFamily: "Roboto_400Regular",
    fontSize: 16,
    lineHeight: 19.2,
    textAlign: "center",
    width: 360,
  },
  buttonWrapper: {
    flexDirection: "row",
    gap: 16,
  },
  button: {
    width: "47%",
  },
});
