import { NotificationHelper } from "@/helpers/notification-helper";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useAppSettingsStore } from "@/stores/app-settings-store";
import { useFeedBackStore } from "@/stores/feedback-store";
import { useNotificationDataStore } from "@/stores/notification-data-store";
import { useAuthStore } from "@/stores/use-auth-store";
import { useUserStore } from "@/stores/use-user-store";
import { api } from "@/utils/axiosInstance";
import { queryClient } from "@/utils/query-client";
import { clearTokens } from "@/utils/tokenUtils";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import CustomButton from "../custom-button/custom-button";
import Loader from "../loader";

const deleteAccountMutation = async () => {
  await api.delete("users");
};

export default function DeleteAccount({ closeSheet }: { closeSheet: () => void }) {
  const { showFeedBack } = useFeedBackStore();

  const { isPending, mutate } = useMutation({
    mutationFn: deleteAccountMutation,
    async onSuccess() {
      // Reset ALL
      closeSheet();
      useAuthStore.getState().setIsAuthenticated(false);
      useUserStore.getState().resetUserData();
      useNotificationDataStore.getState().clearScheduleData();
      useAppSettingsStore.getState().resetAppSetting();
      useAuthStore.getState().resetOnaboarding();
      clearTokens();
      queryClient.clear();
      await NotificationHelper.cancelAllNotifications();
    },

    onError(error) {
      showFeedBack({
        title: "Ошибка!",
        message: "Что-то пошло не так. Пожалуйста, попробуйте еще раз!",
        status: "error",
      });
    },
  });

  const mutedColor = useThemeColor({}, "textMuted");
  return (
    <React.Fragment>
      <Loader visible={isPending} />
      <View style={styles.container}>
        <Text style={[styles.text, { color: mutedColor }]}>
          Все данные, связанные с этим пользователем, будут удалены.
        </Text>
        <View style={styles.buttonWrapper}>
          <CustomButton
            label="Отмена"
            variant="outline"
            textVaraint="tintText"
            style={styles.button}
            onPress={closeSheet}
          />
          <CustomButton
            label="Удалить"
            variant="danger"
            style={styles.button}
            onPress={() => mutate()}
          />
        </View>
      </View>
    </React.Fragment>
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
