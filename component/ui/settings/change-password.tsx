import { useBottomSheet } from "@/component/bottom-sheet-provider";
import { useTranslation } from "@/i18next/i18next";
import { useFeedBackStore } from "@/stores/feedback-store";
import { useAuthStore } from "@/stores/use-auth-store";
import { api, axios } from "@/utils/axiosInstance";
import { queryClient } from "@/utils/query-client";
import { clearTokens } from "@/utils/tokenUtils";
import { validateChangePasswordInputs } from "@/utils/validator";
import { useMutation } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import CustomButton from "../custom-button/custom-button";
import FormInput from "../form/form-input";
import Loader from "../loader";

interface FormState {
  oldPassword: string;
  newPassword: string;
}

type ChangePasswordState = {
  formState: FormState;
  errorsSet: Set<string>;
};

const resetPasswordMutation = async (resetData: FormState) => {
  const response = await api.post("auth/change-password", resetData);
  return response.data;
};

export default function ChangePassword() {
  const { t } = useTranslation();
  const { showFeedBack } = useFeedBackStore();
  const { closeSheet } = useBottomSheet();

  const [changePasswordState, setChangePasswordState] = useState<ChangePasswordState>({
    formState: {
      oldPassword: "",
      newPassword: "",
    },
    errorsSet: new Set(),
  });

  const timerRef = useRef<NodeJS.Timeout>(null);

  const handleOnValueChanges = ({ name, value }: { name: string; value: string }) => {
    setChangePasswordState((prvState) => {
      const updatedErrors = new Set(prvState.errorsSet);
      updatedErrors.delete(name);
      return {
        ...prvState,
        formState: {
          ...prvState.formState,
          [name]: value,
        },
        errorsSet: updatedErrors,
      };
    });

    if (name === "repeatPassword") {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        if (value !== changePasswordState.formState.newPassword) {
          setChangePasswordState((prvState) => ({
            ...prvState,
            errorsSet: new Set(prvState.errorsSet).add("repeatPassword"),
          }));
        } else {
          setChangePasswordState((prvState) => {
            const updateErrors = new Set(prvState.errorsSet);
            updateErrors.delete("repeatPassword");
            return {
              ...prvState,
              errorsSet: updateErrors,
            };
          });
        }
      }, 1000);
    }
  };

  const { isPending, mutate } = useMutation({
    mutationFn: resetPasswordMutation,
    async onSuccess() {
      showFeedBack({
        title: t("feedback.success.change_password.title"),
        message: t("feedback.success.change_password.text"),
        status: "success",
      });

      setChangePasswordState({
        formState: {
          oldPassword: "",
          newPassword: "",
        },
        errorsSet: new Set(),
      });

      queryClient.clear();
      closeSheet();
      await clearTokens();
      useAuthStore.getState().setIsAuthenticated(false);
    },

    onError(error) {
      if (axios.isAxiosError(error)) {
        if (error.code === "ERR_NETWORK") {
          showFeedBack({
            title: t("feedback.error.network.title"),
            message: t("feedback.error.network.text"),
            status: "error",
          });
        } else if (error.response?.status === 401) {
          showFeedBack({
            title: t("feedback.error.update_password.title"),
            message: t("feedback.error.update_password.text"),
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

  const handleResetPassword = () => {
    const validatedInputs = validateChangePasswordInputs(changePasswordState.formState);
    if (validatedInputs.error) {
      validatedInputs.error.issues.forEach((issue) => {
        setChangePasswordState((prvState) => {
          return {
            ...prvState,
            errorsSet: new Set(prvState.errorsSet).add(issue.path[0].toString()),
          };
        });
      });
      return;
    } else if (changePasswordState.errorsSet.has("repeatPassword")) {
      return;
    }
    mutate(validatedInputs.data);
  };

  return (
    <React.Fragment>
      <Loader visible={isPending} />
      <View style={styles.container}>
        <FormInput
          label={t("settings_screen.security_password_input1_label")}
          name="oldPassword"
          onValueChange={handleOnValueChanges}
          type="password"
          placeholder={t("settings_screen.security_password_input1_placeholder")}
          hasError={changePasswordState.errorsSet.has("oldPassword")}
          returnKeyType="next"
        />

        <FormInput
          label={t("settings_screen.security_password_input2_label")}
          name="newPassword"
          onValueChange={handleOnValueChanges}
          type="password"
          placeholder={t("settings_screen.security_password_input2_placeholder")}
          hasError={changePasswordState.errorsSet.has("newPassword")}
          textContentType="newPassword"
          autoComplete="new-password"
          returnKeyType="next"
        />

        <FormInput
          label={t("settings_screen.security_password_input3_label")}
          name="repeatPassword"
          onValueChange={handleOnValueChanges}
          type="password"
          placeholder={t("settings_screen.security_password_input3_placeholder")}
          hasError={changePasswordState.errorsSet.has("repeatPassword")}
          returnKeyType="done"
        />

        <CustomButton
          label={t("settings_screen.security_password_title")}
          disabled={isPending}
          onPress={handleResetPassword}
        />
      </View>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
});
