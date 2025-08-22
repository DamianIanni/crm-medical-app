"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TextField } from "@/components/forms/fields/textField";
import { ButtonLoading } from "@/components/ui/ButtonLoading";
import { useTranslations } from "next-intl";
import { AlertMessage } from "@/components/feedback/AlertMessage";
import { cn } from "@/lib/utils";
import { useSendResetPasswordEmail } from "@/hooks/user/useUser";
// Schema and form types
const forgotPasswordSchema = (v: ReturnType<typeof useTranslations>) =>
  z.object({
    email: z.string().email(v("emailInvalid")),
  });

type ForgotPasswordFormValues = z.infer<
  ReturnType<typeof forgotPasswordSchema>
>;

export default function ForgotPasswordPage() {
  const {
    mutate: sendResetPasswordEmail,
    isError: isSendResetPasswordEmailError,
    isSuccess: isSendResetPasswordEmailSuccess,
    isPending: isSendResetPasswordEmailPending,
  } = useSendResetPasswordEmail();
  const t = useTranslations("ForgotPasswordPage");
  const v = useTranslations("ValidationErrors");
  //   const { sendResetPasswordEmail } = useAuth(); // assume placeholder in auth context

  const schema = useMemo(() => forgotPasswordSchema(v), [v]);
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    try {
      sendResetPasswordEmail(values.email);
    } catch (err) {
      console.error(err);
    }
  }

  if (isSendResetPasswordEmailSuccess) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
        <Card className="w-full max-w-md overflow-hidden shadow-lg">
          <div className="bg-primary/5 p-1">
            <div className="flex items-center justify-center p-4">
              <div className="rounded-full bg-green-100 p-3">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </div>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">
              {t("successTitle", { email: form.getValues("email") })}
            </CardTitle>
            <p className="text-muted-foreground text-sm">
              {t("successDescription")}
            </p>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="mt-4 flex flex-col space-y-3">
              <Link
                href="/"
                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {t("backToLogin")}
              </Link>
              <p className="text-center text-xs text-muted-foreground">
                {t("noEmailReceived")}{' '}
                <button
                  type="button"
                  onClick={() => form.reset()}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  {t("resendEmail")}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-10">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
              <TextField
                control={form.control}
                name="email"
                label={t("emailLabel")}
                disabled={isSendResetPasswordEmailPending}
                type="email"
              />
              {isSendResetPasswordEmailPending ? (
                <ButtonLoading text={t("sending") as string} />
              ) : (
                <Button type="submit" className="w-full">
                  {t("submitButton")}
                </Button>
              )}
              <div className="text-center text-sm">
                <Link
                  href="/"
                  className={cn(
                    "underline underline-offset-4 hover:text-primary",
                    isSendResetPasswordEmailPending &&
                      "pointer-events-none text-muted-foreground opacity-50"
                  )}
                >
                  {t("backToLogin")}
                </Link>
              </div>
            </form>
          </Form>
          {isSendResetPasswordEmailError && (
            <AlertMessage
              className="mt-4"
              title={t("errorTitle")}
              description={t("errorDescription")}
              messages={[]}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
