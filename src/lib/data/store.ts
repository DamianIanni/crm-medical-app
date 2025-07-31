/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/data/store.ts
"use server";
import fs from "fs/promises";
import path from "path";

const FILE_PATH_PATIENT = path.join(
  process.cwd(),
  "src",
  "lib",
  "data",
  "patients.json"
);
const FILE_PATH_USERS = path.join(
  process.cwd(),
  "src",
  "lib",
  "data",
  "users.json"
);
const FILE_PATH_CENTERS = path.join(
  process.cwd(),
  "src",
  "lib",
  "data",
  "centers.json"
);

export async function readPatients() {
  const file = await fs.readFile(FILE_PATH_PATIENT, "utf-8");
  return JSON.parse(file);
}

export async function writePatients(data: any) {
  await fs.writeFile(FILE_PATH_PATIENT, JSON.stringify(data, null, 2), "utf-8");
}

export async function readUsers() {
  const content = await fs.readFile(FILE_PATH_USERS, "utf-8");
  return JSON.parse(content);
}

export async function writeUsers(users: any): Promise<void> {
  await fs.writeFile(FILE_PATH_USERS, JSON.stringify(users, null, 2), "utf-8");
}

export async function readCenters() {
  const content = await fs.readFile(FILE_PATH_CENTERS, "utf-8");
  return JSON.parse(content);
}

export async function writeCenters(centers: any) {
  await fs.writeFile(
    FILE_PATH_CENTERS,
    JSON.stringify(centers, null, 2),
    "utf-8"
  );
}
