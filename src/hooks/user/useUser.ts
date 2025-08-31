import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAccount } from "@/services/api/account";
import { useTranslations } from "next-intl";
import { deleteAccount } from "@/services/api/account";
import { ToastFeedback } from "@/components/feedback/toastFeedback";
import { resetPassword, sendResetPasswordEmail } from "@/services/api/auth";

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("Account");

  return useMutation({
    mutationFn: ({
      userId,
      updated,
    }: {
      userId: string;
      updated: { first_name?: string; last_name?: string };
    }) => updateAccount(userId, updated),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      ToastFeedback({
        type: "success",
        title: t("toast.updateSuccess"),
      });
    },
    onError: (error) => {
      console.error("Error updating user:", error);
      ToastFeedback({
        type: "error",
        title: t("toast.updateError"),
        description: error instanceof Error ? error.message : undefined,
      });
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  const t = useTranslations("Account");

  return useMutation({
    mutationFn: () => deleteAccount(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      ToastFeedback({
        type: "success",
        title: t("toast.deleteSuccess"),
      });
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
      ToastFeedback({
        type: "error",
        title: t("toast.deleteError"),
        description: error instanceof Error ? error.message : undefined,
      });
    },
  });
};

export const useSendResetPasswordEmail = () => {
  const t = useTranslations("Account");

  return useMutation({
    mutationFn: (email: string) => sendResetPasswordEmail(email),
    onSuccess: () => {
      ToastFeedback({
        type: "success",
        title: t("toast.deleteSuccess"),
      });
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
      ToastFeedback({
        type: "error",
        title: t("toast.deleteError"),
        description: error instanceof Error ? error.message : undefined,
      });
    },
  });
};

export const useResetPassword = () => {
  const t = useTranslations("Account");

  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      resetPassword(token, password),
    onSuccess: () => {
      ToastFeedback({
        type: "success",
        title: t("toast.deleteSuccess"),
      });
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
      ToastFeedback({
        type: "error",
        title: t("toast.deleteError"),
        description: error instanceof Error ? error.message : undefined,
      });
    },
  });
};
