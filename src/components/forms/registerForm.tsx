/**
 * Register Form Component
 *
 * This component provides a comprehensive registration interface with email/password form
 * validation, loading states, error handling, and navigation upon successful registration.
 * Uses React Hook Form with Zod validation for form management.
 */

"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TextField } from "./fields/textField";
import { PasswordField } from "./fields/passwordField";
import { useTranslations } from "next-intl";

import { useAuth } from "../providers/AuthProvider";

import { getRegisterSchema } from "@/lib/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Control } from "react-hook-form";
import { z } from "zod";

import { AlertMessage } from "../feedback/AlertMessage";

import { useRouter } from "next/navigation";

import { Form } from "@/components/ui/form";

import { ButtonLoading } from "../ui/ButtonLoading";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  // Get authentication functions and state from auth context
  const {
    register: registerUser,
    isRegisterPending,
    isErrorRegister,
  } = useAuth();
  const router = useRouter();
  const t = useTranslations("RegisterForm");
  const v = useTranslations("ValidationErrors");

  // Initialize form with validation schema and default values
  const registerSchema = useMemo(() => getRegisterSchema(v), [v]);
  type FormData = z.infer<typeof registerSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      first_name: "",
      last_name: "",
    },
  });

  // Error message configuration for registration errors
  const registrationError = {
    title: t("registrationErrorTitle"),
    description: t("registrationErrorDescription"),
    data: t.raw("registrationErrorData") as string[],
  };

  /**
   * Navigates user to dashboard after successful registration
   */
  function navigateToDashboard() {
    router.replace("/login");
  }

  /**
   * Handles form submission for registration
   *
   * @param values - Form values containing registration information
   */
  const onSubmit = async (values: FormData) => {
    // Map form fields to backend expected format
    const registerData = {
      firstName: values.first_name,
      lastName: values.last_name,
      email: values.email,
      password: values.password,
    };

    const res = await registerUser(registerData);
    if (res) {
      navigateToDashboard();
    } else {
      console.log("Registration failed");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) =>
                  onSubmit(data as FormData)
                )}
                className="grid gap-6"
              >
                <TextField
                  control={form.control as unknown as Control<FormData>}
                  name="first_name"
                  label={t("firstNameLabel")}
                  placeholder={t("firstNamePlaceholder")}
                  disabled={isRegisterPending}
                />

                <TextField
                  control={form.control as unknown as Control<FormData>}
                  name="last_name"
                  label={t("lastNameLabel")}
                  placeholder={t("lastNamePlaceholder")}
                  disabled={isRegisterPending}
                />

                <TextField
                  control={form.control as unknown as Control<FormData>}
                  name="email"
                  label={t("emailLabel")}
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  disabled={isRegisterPending}
                />

                <PasswordField
                  control={form.control as unknown as Control<FormData>}
                  name="password"
                  label={t("passwordLabel")}
                  placeholder={t("passwordPlaceholder")}
                  disabled={isRegisterPending}
                />

                <PasswordField
                  control={form.control as unknown as Control<FormData>}
                  name="confirmPassword"
                  label={t("confirmPasswordLabel")}
                  placeholder={t("confirmPasswordPlaceholder")}
                  disabled={isRegisterPending}
                />

                {/* Submit button with loading state */}
                {isRegisterPending ? (
                  <ButtonLoading text={t("creatingLoading")} />
                ) : (
                  <Button type="submit" className="w-full">
                    {t("createButton")}
                  </Button>
                )}
              </form>
            </Form>

            {/* Error message display for failed registration */}
            {isErrorRegister && (
              <AlertMessage
                variant="error"
                title={registrationError.title}
                description={registrationError.description}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
