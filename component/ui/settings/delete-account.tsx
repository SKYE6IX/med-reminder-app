import { NotificationHelper } from "@/helpers/notification-helper";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useTranslation } from "@/i18next/i18next";
import { useAppSettingsStore } from "@/stores/app-settings-store";
import { useFeedBackStore } from "@/stores/feedback-store";
import { useNotificationDataStore } from "@/stores/notification-data-store";
import { useAuthStore } from "@/stores/use-auth-store";
import { useUserStore } from "@/stores/use-user-store";
import { api, axios } from "@/utils/axiosInstance";
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
  const { t } = useTranslation();
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

  const mutedColor = useThemeColor({}, "textMuted");
  return (
    <React.Fragment>
      <Loader visible={isPending} />
      <View style={styles.container}>
        <Text style={[styles.text, { color: mutedColor }]}>
          {t("settings_screen.security_delete_account_sheet_heading")}
        </Text>
        <View style={styles.buttonWrapper}>
          <CustomButton
            label={t("settings_screen.security_delete_account_sheet_cancel")}
            variant="outline"
            textVaraint="tintText"
            style={styles.button}
            onPress={closeSheet}
          />
          <CustomButton
            label={t("settings_screen.security_delete_account_sheet_delete")}
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
