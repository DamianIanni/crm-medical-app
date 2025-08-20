import * as z from "zod";

export const getLoginSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().min(1, t("emailRequired")).email(t("emailInvalid")),
    password: z.string().min(1, t("passwordRequired")),
  });

export const getRegisterSchema = (t: (key: string) => string) =>
  z
    .object({
      email: z.string().min(1, t("emailRequired")).email(t("emailInvalid")),
      password: z.string().min(6, t("passwordMin6")),
      confirmPassword: z.string(),
      first_name: z.string().min(1, t("userFirstNameRequired")),
      last_name: z.string().min(1, t("userLastNameRequired")),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("passwordsDontMatch"),
      path: ["confirmPassword"],
    });

// Infer types from the schema factories
type LoginSchema = ReturnType<typeof getLoginSchema>;
type RegisterSchema = ReturnType<typeof getRegisterSchema>;

export type LoginFormValues = z.infer<LoginSchema>;
export type RegisterFormValues = z.infer<RegisterSchema>;

// Export schema types for form components
export type LoginSchemaType = LoginSchema;
export type RegisterSchemaType = RegisterSchema;
