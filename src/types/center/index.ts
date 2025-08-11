import { Role } from "@/lib/schemas/memberSchema";

export type Center = {
  center_id: string;
  center_name: string;
  center_address: string;
  center_phone: string;
  role: Role;
};
