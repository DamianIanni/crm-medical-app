import type { Patient } from "@/types/patient";

declare global {
  var __mockPatients: Patient[];
}

export {};
