// This file simulates patient management methods in the backend.
// It includes functions to get, create, update, and delete patients.

import { Patient } from "@/types/patient";
import { getUserFromCookies } from "@/lib/api/auth/getUserFromCookies";

import { readPatients, writePatients } from "@/lib/data/store";

export const dynamic = "force-dynamic";

const WAIT = 2000;
function wait(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function getPatientById(id: number): Promise<Patient> {
  await wait(WAIT);
  const patients = await readPatients();
  return patients.find((p: Partial<Patient>) => p.id === id) || null;
}

export async function getPatients(): Promise<Patient[]> {
  await wait(WAIT);
  const user = await getUserFromCookies();
  const allPatients = await readPatients();

  if (!user) throw new Error("Unauthorized");

  if (user.role === "employee") {
    const patientsEmployee: Partial<Patient>[] = allPatients
      .reverse()
      .map(
        ({
          id,
          firstName,
          lastName,
          dob,
          email,
          phoneNumber,
          treatment,
        }: Patient) => ({
          id,
          firstName,
          lastName,
          dob,
          email,
          phoneNumber,
          treatment,
        })
      );

    return patientsEmployee as Patient[];
  }

  return [...allPatients].reverse();
}

export async function createPatient(
  newPatient: Omit<Patient, "id">
): Promise<Patient> {
  await wait(WAIT);
  const user = await getUserFromCookies();
  if (!user || (user.role !== "admin" && user.role !== "manager")) {
    throw new Error("Unauthorized");
  }

  const patients = await readPatients();
  const id = Date.now();

  const newEntry: Patient = {
    ...newPatient,
    id,
    sessionsCompleted: 3,
    sessions: [
      {
        date: "2025-01-01",
        notes: "notes",
      },
    ],
  };

  patients.push(newEntry);
  await writePatients(patients);
  return newEntry;
}

export async function updatePatient(
  id: number,
  updated: Partial<Patient>
): Promise<Patient> {
  await wait(WAIT);
  const user = await getUserFromCookies();
  if (!user || (user.role !== "admin" && user.role !== "manager")) {
    throw new Error("Unauthorized");
  }

  const patients = await readPatients();
  const index = patients.findIndex((p: Partial<Patient>) => p.id === id);
  if (index === -1) throw new Error("Patient not found");

  patients[index] = { ...patients[index], ...updated };
  await writePatients(patients);
  return patients[index];
}

export async function deletePatient(id: number): Promise<Patient> {
  await wait(WAIT);
  const user = await getUserFromCookies();
  if (!user || (user.role !== "admin" && user.role !== "manager")) {
    throw new Error("Unauthorized");
  }

  const patients = await readPatients();
  const index = patients.findIndex((p: Partial<Patient>) => p.id === id);
  if (index === -1) throw new Error("Patient not found");

  const removed = patients[index];
  patients.splice(index, 1);
  await writePatients(patients);
  return removed;
}
