import * as z from "zod";

const phoneRegex =
  /^(\+?(45|44))?\s?\(?0?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}$/;

export const patientSchema = z.object({
  first_name: z
    .string()
    .nonempty("First name is required")
    .min(2, "Must be at least 2 characters"),
  last_name: z
    .string()
    .nonempty("Last name is required")
    .min(2, "Must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  phone: z.string().nonempty("Phone number is required").regex(phoneRegex, {
    message:
      "Enter a valid phone number for Denmark (+45) or UK (+44 or starting with 0)",
  }),
  short_description: z.string(),
  date_of_birth: z.string().refine((date) => new Date(date) < new Date(), {
    message: "Date must be in the past",
  }),
});

export type PatientFormValues = z.infer<typeof patientSchema>;
