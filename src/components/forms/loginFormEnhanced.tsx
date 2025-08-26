/**
 * Enhanced Login Form Component
 *
 * This is the updated version of LoginForm that uses the new error handling system
 * with i18n support and improved error management.
 */

"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TextField } from "./fields/textField";
import { PasswordField } from "./fields/passwordField";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { ButtonLoading } from "../ui/ButtonLoading";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Terminal, AlertCircle } from "lucide-react";

// Import new error handling system
import { useFormErrorHandler } from "@/hooks/useErrorHandler";
import { ErrorCode } from "@/types/errors";
import { login as loginService } from "@/services/api/auth";

// Import i18n error utilities
import { processErrorI18n, isFormErrorI18n, getFieldErrorI18n } from "@/utils/errorHandlerI18n";

import { getLoginSchema, LoginFormValues } from "@/lib/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export function LoginFormEnhanced({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const t = useTranslations("LoginForm");
  const v = useTranslations("ValidationErrors");
  const tNotifications = useTranslations("Notifications");
  const tErrors = useTranslations("Errors");

  // Use the new error handler hook
  const {
    error,
    fieldErrors,
    hasFieldError,
    getErrorForField,
    handleFormSubmit,
    clearError,
    clearFieldError,
  } = useFormErrorHandler();

  // Track loading state
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with validation schema and default values
  const loginSchema = useMemo(() => getLoginSchema(v), [v]);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /**
   * Enhanced form submission with proper error handling
   */
  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      await handleFormSubmit(
        () => loginService(values),
        () => {
          // On success - show notification using translations
          // ToastFeedback({
          //   title: tNotifications("auth.loginSuccessTitle"),
          //   description: tNotifications("auth.loginSuccess"),
          //   type: "success",
          // });
          router.replace("/centers");
        }
      );
    } catch (processedError: any) {
      // Error is already handled by the error handler
      // but we can add specific handling here if needed
      
      if (processedError.code === ErrorCode.AUTH_INVALID_CREDENTIALS) {
        // Focus on the email field to let user try again
        form.setFocus('email');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Clear errors when user starts typing
  const handleFieldFocus = (fieldName: string) => {
    // Clear form validation errors
    form.clearErrors(fieldName);
    
    // Clear API errors for this field
    if (hasFieldError(fieldName)) {
      clearFieldError(fieldName);
    }
  };

  // Get field error with i18n support
  const getFieldErrorI18nMessage = (fieldName: string): string | null => {
    if (!hasFieldError(fieldName) || !error) return null;
    
    // Use i18n error handler to get localized message
    return getFieldErrorI18n(
      processErrorI18n(error.originalError, tErrors), 
      fieldName, 
      tErrors
    );
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardContent>
          <div className="grid gap-4">
            {/* Development demo account info */}
            {process.env.NODE_ENV === "development" && (
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle className="font-bold">
                  {t('demoAccount.title')}
                </AlertTitle>
                <AlertDescription>
                  <div className="space-y-1 text-sm">
                    <p>{t('demoAccount.description')}</p>
                    <p>
                      <strong>{t('demoAccount.email')}</strong> demo@admin.com
                    </p>
                    <p>
                      <strong>{t('demoAccount.password')}</strong> password123
                    </p>
                    <p className="text-xs mt-2 text-muted-foreground">
                      {t('demoAccount.note')}
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Show general errors (non-field specific) */}
            {error && !hasFieldError('email') && !hasFieldError('password') && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error de autenticación</AlertTitle>
                <AlertDescription>
                  {processErrorI18n(error.originalError, tErrors).message}
                </AlertDescription>
              </Alert>
            )}

            {/* Login form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-6"
              >
                <div className="space-y-4">
                  <TextField
                    control={form.control}
                    name="email"
                    label={t("emailLabel")}
                    disabled={isLoading}
                    onFocus={() => handleFieldFocus('email')}
                    // Show API errors for this field
                    error={hasFieldError('email')}
                    helperText={
                      hasFieldError('email') 
                        ? getFieldErrorI18nMessage('email')
                        : undefined
                    }
                  />
                  
                  <PasswordField
                    control={form.control}
                    name="password"
                    label={t("passwordLabel")}
                    disabled={isLoading}
                    onFocus={() => handleFieldFocus('password')}
                    // Show API errors for this field
                    error={hasFieldError('password')}
                    helperText={
                      hasFieldError('password') 
                        ? getFieldErrorI18nMessage('password')
                        : undefined
                    }
                  />
                </div>

                {/* Submit button with loading state */}
                {isLoading ? (
                  <ButtonLoading text="Iniciando sesión..." />
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
                      isLoading &&
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
                      isLoading &&
                        "pointer-events-none text-muted-foreground opacity-50"
                    )}
                  >
                    {t("signupLink")}
                  </Link>
                </div>
              </form>
            </Form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
