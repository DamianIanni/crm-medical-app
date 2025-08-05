import { z } from "zod";

export const centerSchema = z.object({
  name: z.string().min(1, "Center name is required"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
});

export type CenterSchemaType = z.infer<typeof centerSchema>;
