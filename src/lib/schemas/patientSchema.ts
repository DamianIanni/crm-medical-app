import * as z from "zod";

const phoneRegex =
  /^(\+?(45|44))?\s?\(?0?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}$/;

export const getPatientSchema = (t: (key: string) => string) =>
  z.object({
  first_name: z
    .string()
    .nonempty(t("patientFirstNameRequired"))
    .min(2, t("patientFirstNameMin2")),
  last_name: z
    .string()
    .nonempty(t("patientLastNameRequired"))
    .min(2, t("patientLastNameMin2")),
  email: z.string().min(1, t("patientEmailRequired")).email(t("patientEmailInvalid")),
  phone: z.string().nonempty(t("patientPhoneRequired")).regex(phoneRegex, {
    message: t("patientPhoneInvalid"),
  }),
  short_description: z.string(),
  date_of_birth: z.string().refine((date) => new Date(date) < new Date(), {
    message: t("patientDobPast"),
  }),
  });

export type PatientFormValues = z.infer<ReturnType<typeof getPatientSchema>>;
