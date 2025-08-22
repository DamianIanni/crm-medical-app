"use client";

import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import {
  getProfileSchema,
  ProfileFormValues,
} from "@/lib/schemas/profileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { TextField } from "./fields/textField";
import { useUpdateAccount, useDeleteAccount } from "@/hooks/user/useUser";
import { ActionDialog } from "@/components/feedback/actionDialog";

export function ProfileForm(
  user: ProfileFormValues & { id: string }
): React.ReactElement {
  const { first_name, last_name, email, id } = user.user;
  const router = useRouter();
  const updateUser = useUpdateAccount();
  const { isPending: isDeletingAccount, mutate: deleteAccount } =
    useDeleteAccount();
  const t = useTranslations("ProfileForm");
  const v = useTranslations("ValidationErrors");

  const profileSchema = useMemo(() => getProfileSchema(v), [v]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: first_name || "",
      last_name: last_name || "",
      email: email || "",
    },
  });

  const realIsUnchanged =
    first_name === form.watch("first_name") &&
    last_name === form.watch("last_name");

  const isUnchanged = useMemo(() => {
    return (
      form.watch("first_name") === first_name &&
      form.watch("last_name") === last_name
    );
  }, [form, first_name, last_name]);

  async function onSubmit(values: ProfileFormValues) {
    if (!first_name || !last_name) return;

    try {
      await updateUser.mutateAsync({
        userId: id,
        updated: values,
      });
      router.refresh();
    } catch (error) {
      console.error("Profile update error:", error);
    }
  }

  const handleDeleteAccount = async () => {
    try {
      deleteAccount();
      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Account deletion error:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("w-full max-w-2xl mx-auto space-y-6")}
      >
        <div className="rounded-lg p-6">
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">{t("title")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("description")}
                </p>
              </div>
              <ActionDialog
                title={t("deleteAccount.title")}
                description={t("deleteAccount.description")}
                onConfirm={handleDeleteAccount}
                // variant="delete"
                triggerProps={{
                  variant: "outline",
                  size: "sm",
                  className: "text-destructive hover:text-destructive",
                }}
              >
                {/* <Trash2 className="h-4 w-4 mr-2" /> */}
                {/* {t("deleteAccount.button")} */}
              </ActionDialog>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <TextField
                name="first_name"
                label={t("firstNameLabel")}
                control={form.control}
                disabled={updateUser.isPending}
              />
              <TextField
                name="last_name"
                label={t("lastNameLabel")}
                control={form.control}
                disabled={updateUser.isPending}
              />
              <div className="md:col-span-2">
                <TextField
                  name="email"
                  label={t("emailLabel")}
                  control={form.control}
                  disabled={true}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-4">
              <Button
                type="submit"
                disabled={
                  updateUser.isPending || realIsUnchanged || isDeletingAccount
                }
              >
                {updateUser.isPending ? t("saving") : t("saveButton")}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
