import { z } from "zod";

export const getProfileSchema = (v: (key: string) => string) =>
  z.object({
    first_name: z.string().min(1, v("firstNameRequired")),
    last_name: z.string().min(1, v("lastNameRequired")),
    email: z.string().email(v("emailInvalid")).optional(),
  });

export type ProfileFormValues = z.infer<ReturnType<typeof getProfileSchema>>;
