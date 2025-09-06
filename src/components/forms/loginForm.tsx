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
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle className="font-bold">
                  {t("demoAccount.title")}
                </AlertTitle>
                <AlertDescription>
                  <div className="space-y-3 text-sm">
                    <p>{t("demoAccount.description")}</p>

                    <div className="grid gap-2 p-2 rounded-md bg-muted/50">
                      <div>
                        <div className="font-medium text-xs uppercase tracking-wide text-muted-foreground mb-1">
                          {t("demoAccount.email")}:
                        </div>
                        <div className="grid gap-1">
                          <div className="flex items-center gap-2 bg-background/80 p-1.5 px-2 rounded border border-border/50">
                            <span className="bg-purple-500/10 text-purple-500 px-1.5 py-0.5 rounded text-xs font-medium">
                              Admin
                            </span>
                            <code className="text-sm">demo@admin.com</code>
                          </div>
                          <div className="flex items-center gap-2 bg-background/80 p-1.5 px-2 rounded border border-border/50">
                            <span className="bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded text-xs font-medium">
                              Manager
                            </span>
                            <code className="text-sm">demo@manager.com</code>
                          </div>
                          <div className="flex items-center gap-2 bg-background/80 p-1.5 px-2 rounded border border-border/50">
                            <span className="bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded text-xs font-medium">
                              Employee
                            </span>
                            <code className="text-sm">demo@employee.com</code>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="font-medium text-xs uppercase tracking-wide text-muted-foreground mb-1">
                          {t("demoAccount.password")}:
                        </div>
                        <div className="bg-background/80 p-1.5 px-2 rounded border border-border/50">
                          <code className="text-sm">password123</code>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground italic">
                      {t("demoAccount.note")}
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
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
                messages={invalidCredentials.data}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
