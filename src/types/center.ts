export interface Center {
  id: string;
  center_id: string; // Added to match API response
  name: string;
  phone: string;
  address: string;
  createdAt?: string;
  updatedAt?: string;
  total_patients?: number;
  total_users?: number;
  role: "admin" | "manager" | "employee"; // Added to match API response
}
