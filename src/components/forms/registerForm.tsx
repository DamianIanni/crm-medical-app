/**
 * Register Form Component
 *
 * This component provides a comprehensive registration interface with email/password form
 * validation, loading states, error handling, and navigation upon successful registration.
 * Uses React Hook Form with Zod validation for form management.
 */

"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TextField } from "./fields/textField";
import { PasswordField } from "./fields/passwordField";

import { useAuth } from "../providers/AuthProvider";

import { registerSchema, RegisterSchemaType } from "@/lib/schemas/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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

  // Initialize form with validation schema and default values
  const form = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
  });

  // Error message configuration for registration errors
  const registrationError = {
    title: "Registration failed",
    description: "Please check your information and try again.",
    data: [
      "Check your email format",
      "Password must be at least 6 characters",
      "Passwords must match",
    ],
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
  async function onSubmit(values: RegisterSchemaType) {
    // Map form fields to backend expected format
    const registerData = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
    };

    const res = await registerUser(registerData);
    if (res) {
      navigateToDashboard();
    } else {
      console.log("Registration failed");
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-6"
              >
                <TextField
                  control={form.control}
                  name="firstName"
                  label="First Name"
                  placeholder="Enter your first name"
                  disabled={isRegisterPending}
                />

                <TextField
                  control={form.control}
                  name="lastName"
                  label="Last Name"
                  placeholder="Enter your last name"
                  disabled={isRegisterPending}
                />

                <TextField
                  control={form.control}
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="john@example.com"
                  disabled={isRegisterPending}
                />

                <PasswordField
                  control={form.control}
                  name="password"
                  label="Password"
                  placeholder="Create a password"
                  disabled={isRegisterPending}
                />

                <PasswordField
                  control={form.control}
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  disabled={isRegisterPending}
                />

                {/* Submit button with loading state */}
                {isRegisterPending ? (
                  <ButtonLoading text="Creating account..." />
                ) : (
                  <Button type="submit" className="w-full">
                    Create account
                  </Button>
                )}
              </form>
            </Form>

            {/* Error message display for failed registration */}
            {isErrorRegister && (
              <AlertMessage
                title={registrationError.title}
                description={registrationError.description}
                data={registrationError.data}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
