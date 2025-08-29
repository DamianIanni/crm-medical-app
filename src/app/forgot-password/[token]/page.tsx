"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { PasswordField } from "@/components/forms/fields/passwordField";
import { ButtonLoading } from "@/components/ui/ButtonLoading";
import { AlertMessage } from "@/components/feedback/AlertMessage";
import { useResetPassword } from "@/hooks/user/useUser";
import { useParams } from "next/navigation";
import { PageAnimationWrapper } from "@/components/wrappers/pageAnimationWrapper";

// Schema for password reset
const resetSchema = (v: ReturnType<typeof useTranslations>) =>
  z
    .object({
      password: z.string().min(6, v("passwordMin6")).max(100),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: v("passwordsDontMatch"),
      path: ["confirmPassword"],
    });

type ResetFormValues = z.infer<ReturnType<typeof resetSchema>>;

export default function ResetPasswordPage() {
  const t = useTranslations("ResetPasswordPage");
  const v = useTranslations("ValidationErrors");
  const router = useRouter();
  const params = useParams();

  // 4. Accede al token. Es buena práctica asegurarse de que es un string.
  const token = Array.isArray(params.token) ? params.token[0] : params.token;
  const {
    mutate: resetPassword,
    isPending: isResetPasswordPending,
    isError: isResetPasswordError,
    isSuccess: isResetPasswordSuccess,
  } = useResetPassword();

  const schema = useMemo(() => resetSchema(v), [v]);
  const form = useForm<ResetFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(values: ResetFormValues) {
    console.log("Valores del formulario:", values);
    console.log("Token:", token);
    if (!token) return;
    try {
      resetPassword({ token, password: values.password });
    } catch (err) {
      console.error(err);
    }
  }

  if (isResetPasswordSuccess) {
    return (
      <PageAnimationWrapper>
        <div className="flex justify-center py-10">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>{t("successTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p className="text-center text-sm text-muted-foreground">
                {t("successDescription")}
              </p>
              <Button className="w-full" onClick={() => router.push("/")}>
                {t("goToLogin")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageAnimationWrapper>
    );
  }

  return (
    <PageAnimationWrapper>
      <div className="flex justify-center py-10">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{t("title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-6"
              >
                <PasswordField
                  control={form.control}
                  name="password"
                  label={t("passwordLabel")}
                  disabled={isResetPasswordPending}
                />
                <PasswordField
                  control={form.control}
                  name="confirmPassword"
                  label={t("confirmPasswordLabel")}
                  disabled={isResetPasswordPending}
                />
                {isResetPasswordPending ? (
                  <ButtonLoading text={t("resetting") as string} />
                ) : (
                  <Button type="submit" className="w-full">
                    {t("submitButton")}
                  </Button>
                )}
              </form>
            </Form>
            {isResetPasswordError && (
              <AlertMessage
                title={t("errorTitle")}
                description={t("errorDescription")}
                messages={[]}
                className="mt-4"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </PageAnimationWrapper>
  );
}
