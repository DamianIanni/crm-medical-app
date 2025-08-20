import * as z from "zod";

const roles = ["employee", "manager", "admin"] as const;

type Role = (typeof roles)[number];

export const getMemberSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().min(1, t("memberEmailRequired")).email(t("memberEmailInvalid")),
    first_name: z.string().min(1, t("memberFirstNameRequired")),
    last_name: z.string().min(1, t("memberLastNameRequired")),
    role: z.enum(roles, { required_error: t("memberRoleRequired") }),
  });

export const dataUserFilterSchema = z.object({
  center_id: z.string(),
  center_name: z.string(),
  email: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  role: z.enum(roles),
  status: z.string(),
  user_id: z.string(),
});

export type DataUserFilter = z.infer<typeof dataUserFilterSchema>;
export type MemberFormValues = z.infer<ReturnType<typeof getMemberSchema>>;
export type { Role };
