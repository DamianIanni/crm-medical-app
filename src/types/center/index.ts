import { Role } from "@/lib/schemas/memberSchema";

export type UserStatus = "active" | "pending" | "rejected";

export interface Center {
  center_id: string;
  id?: string; // Added for compatibility with Actions component
  name: string;
  address: string;
  phone: string;
  email?: string;
  website?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  // Aliases for compatibility
  createdAt?: string;
  updatedAt?: string;
  total_patients?: number;
  total_users?: number;
  role: Role;
  status?: UserStatus;
}
