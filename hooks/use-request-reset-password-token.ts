import { useFeedBackStore } from "@/stores/feedback-store";
import { api, axios } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";

const requestPasswordResetTokenMutation = async ({ email }: { email: string }) => {
  const reponse = await api.post<{ status: string }>("auth/forget-password/token", { email });
  return reponse.data;
};

export const useRequestResetPasswordToken = ({
  onSuccessAction,
}: {
  onSuccessAction: () => void;
}) => {
  const { showFeedBack } = useFeedBackStore();
  const { mutate: requestResetPasswordToken, isPending } = useMutation({
    mutationFn: requestPasswordResetTokenMutation,
    onSuccess() {
      showFeedBack({
        title: "Код отправлен!",
        message: "Проверьте свою электронную почту на наличие кода.",
        status: "success",
      });
      onSuccessAction();
    },
    onError(error) {
      console.log("An Error occur");
      if (axios.isAxiosError(error)) {
        error.response?.status === 401 &&
          showFeedBack({
            title: "Не удалось авторизовать!",
            message: "Пользователь с таким адресом электронной почты не существует!",
            status: "error",
          });
      } else {
        showFeedBack({
          title: "Ошибка!",
          message: "Что-то пошло не так. Пробовать снова.",
          status: "error",
        });
        console.log("An unknown error occur in sign in mutation", error);
      }
    },
  });
  return {
    requestResetPasswordToken,
    isPending,
  };
};
