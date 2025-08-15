import { Role } from "@/lib/schemas/memberSchema";

export type UserStatus = "active" | "pending" | "rejected";

export interface Center {
  center_id: string;
  center_name: string;
  center_address: string;
  center_phone: string;
  email?: string;
  website?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  role: Role;
  status?: UserStatus;
}
