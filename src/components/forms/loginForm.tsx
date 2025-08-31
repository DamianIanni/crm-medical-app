/**
 * Login Form Component
 *
 * This component provides a comprehensive login interface with multiple authentication options.
 * It includes social login buttons (Apple, Google), email/password form with validation,
 * loading states, error handling, and navigation upon successful authentication.
 * Uses React Hook Form with Zod validation for form management.
 */

"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TextField } from "./fields/textField";
import { PasswordField } from "./fields/passwordField";
import { useTranslations } from "next-intl";

import { useAuth } from "../providers/AuthProvider";

import { getLoginSchema, LoginFormValues } from "@/lib/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AlertMessage } from "../feedback/AlertMessage";

import { useRouter } from "next/navigation";

import { Form } from "@/components/ui/form";

import { ButtonLoading } from "../ui/ButtonLoading";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Terminal } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  // Get authentication functions and state from auth context
  const { login, isLoginPending, isErrorLogin } = useAuth();
  const router = useRouter();
  const t = useTranslations("LoginForm");
  const v = useTranslations("ValidationErrors");

  // Initialize form with validation schema and default values
  const loginSchema = useMemo(() => getLoginSchema(v), [v]);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Error message configuration for invalid credentials
  const invalidCredentials = {
    title: t("invalidCredentialsTitle"),
    description: t("invalidCredentialsDescription"),
    data: t.raw("invalidCredentialsData") as string[],
  };

  /**
   * Handles form submission for email/password login
   *
   * @param values - Form values containing email and password
   */
  async function onSubmit(values: LoginFormValues) {
    const loginSuccess = await login(values);

    if (loginSuccess) {
      router.replace("/centers");
    } else {
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardContent>
          <div className="grid gap-4">
            {/* Social login buttons section */}
            <div className="flex flex-col gap-4">
              {process.env.NODE_ENV === "development" && (
                <Alert>
                  <Terminal className="h-4 w-4" />
                  <AlertTitle className="font-bold">
                    {t("demoAccount.title")}
                  </AlertTitle>
                  <AlertDescription>
                    <div className="space-y-1 text-sm">
                      <p>{t("demoAccount.description")}</p>
                      <p>
                        <strong>{t("demoAccount.email")}</strong> demo@admin.com
                      </p>
                      <p>
                        <strong>{t("demoAccount.password")}</strong> password123
                      </p>
                      <p className="text-xs mt-2 text-muted-foreground">
                        {t("demoAccount.note")}
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Email/password login form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-6"
              >
                <TextField
                  control={form.control}
                  // type="email"
                  name="email"
                  label={t("emailLabel")}
                  disabled={isLoginPending}
                />
                <PasswordField
                  control={form.control}
                  name="password"
                  label={t("passwordLabel")}
                  disabled={isLoginPending}
                />
                {/* Submit button with loading state */}
                {isLoginPending ? (
                  <ButtonLoading text={"Loading"} />
                ) : (
                  <Button type="submit" className="w-full">
                    {t("loginButton")}
                  </Button>
                )}
                {/* Forgot password link */}
                <div className="text-center text-sm">
                  <Link
                    href="/forgot-password"
                    className={cn(
                      "underline underline-offset-4 hover:text-primary",
                      isLoginPending &&
                        "pointer-events-none text-muted-foreground opacity-50"
                    )}
                  >
                    {t("forgotPasswordLink")}
                  </Link>
                </div>
                {/* Register link */}
                <div className="text-center text-sm">
                  {t("signupPrompt")}{" "}
                  <Link
                    href="/register"
                    className={cn(
                      "underline underline-offset-4 hover:text-primary",
                      isLoginPending &&
                        "pointer-events-none text-muted-foreground opacity-50"
                    )}
                  >
                    {t("signupLink")}
                  </Link>
                </div>
              </form>
            </Form>
            {/* Error message display for failed login attempts */}
            {isErrorLogin && (
              <AlertMessage
                title={invalidCredentials.title}
                description={invalidCredentials.description}
                data={invalidCredentials.data}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
