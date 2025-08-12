import * as z from "zod";

const roles = ["employee", "manager", "admin"] as const;

type Role = (typeof roles)[number];

export const memberSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  role: z.enum(roles),
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
export type MemberFormValues = z.infer<typeof memberSchema>;
export type { Role };
