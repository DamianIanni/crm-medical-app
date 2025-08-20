import * as z from "zod";

const phoneRegex =
  /^(\+?(45|44))?\s?\(?0?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}$/;

export const getCenterSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t("centerNameRequired")),
    phone: z.string().min(1, t("centerPhoneRequired")).regex(phoneRegex, {
      message: t("centerPhoneInvalid"),
    }),
    address: z.string().min(1, t("centerAddressRequired")),
  });

export type CenterFormValues = z.infer<ReturnType<typeof getCenterSchema>>;
