/**
 * Enhanced Login Form Component - Example Implementation
 * 
 * This is an example of how to update the existing LoginForm to use the new
 * error handling system. This demonstrates integration with the new error codes
 * and field-specific error handling.
 */

"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TextField } from "../components/forms/fields/textField";
import { PasswordField } from "../components/forms/fields/passwordField";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { ButtonLoading } from "../components/ui/ButtonLoading";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Terminal, AlertCircle } from "lucide-react";

// Import the new error handling system
import { useFormErrorHandler } from "@/hooks/useErrorHandler";
import { ErrorCode } from "@/types/errors";
import { notifications } from "@/utils/notifications";

import { getLoginSchema, LoginFormValues } from "@/lib/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// Assuming you have a login service function
import { login as loginService } from "@/services/api/auth";

export function EnhancedLoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const t = useTranslations("LoginForm");
  const v = useTranslations("ValidationErrors");

  // Use the new error handler hook
  const {
    error,
    fieldErrors,
    getFieldProps,
    handleFormSubmit,
    clearError,
    hasFieldError,
  } = useFormErrorHandler();

  // Initialize form with validation schema and default values
  const loginSchema = useMemo(() => getLoginSchema(v), [v]);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Track loading state
  const [isLoading, setIsLoading] = React.useState(false);

  /**
   * Enhanced form submission with proper error handling
   */
  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      const result = await handleFormSubmit(
        () => loginService(values),
        () => {
          // On success
          notifications.auth.loginSuccess();
          router.replace("/centers");
        }
      );

      if (result) {
        // Success handled in callback above
      }
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
      clearError();
    }
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
                <AlertDescription>{error.message}</AlertDescription>
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
                        ? getFieldProps('email').helperText
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
                        ? getFieldProps('password').helperText
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

/**
 * Usage Examples for different scenarios:
 */

// Example 1: Using with React Query mutation
export function LoginFormWithReactQuery() {
  const { onMutationError } = useQueryErrorHandler();

  // Example mutation setup
  const loginMutation = {
    onError: onMutationError, // This will automatically handle error display
    onSuccess: () => {
      notifications.auth.loginSuccess();
      // redirect logic
    }
  };

  return <div>React Query version</div>;
}

// Example 2: Using the general error handler for manual API calls
export function ManualErrorHandlingExample() {
  const { withErrorHandling } = useErrorHandler();

  const handleLogin = async (credentials: LoginFormValues) => {
    const result = await withErrorHandling(
      () => loginService(credentials),
      {
        loadingState: true,
        onSuccess: () => {
          notifications.auth.loginSuccess();
          // redirect
        },
        onError: (error) => {
          // Custom error handling if needed
          if (error.code === ErrorCode.AUTH_INVALID_CREDENTIALS) {
            // Do something specific
          }
        }
      }
    );

    return result;
  };

  return <div>Manual error handling version</div>;
}

// Export the main component
export default EnhancedLoginForm;
