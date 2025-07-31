// src/lib/api/users.ts

// This file simulates user management methods in the backend.
// It includes functions to get, create, update, and delete users.

import { User } from "@/types/user";
import { getUserFromCookies } from "@/lib/api/auth/getUserFromCookies";
import { readUsers, writeUsers } from "@/lib/data/store";

export const dynamic = "force-dynamic";

const WAIT = 2000;
function wait(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function getUserById(id: number): Promise<User> {
  await wait(WAIT);
  const users = await readUsers();
  return users.find((u: Partial<User>) => u.id === id) || null;
}

export async function getUsers(): Promise<User[]> {
  await wait(WAIT);
  const user = await getUserFromCookies();
  if (!user || (user.role !== "admin" && user.role !== "manager")) {
    throw new Error("Unauthorized");
  }
  return await readUsers();
}

export async function createUser(newUser: Omit<User, "id">): Promise<User> {
  await wait(WAIT);
  const user = await getUserFromCookies();
  if (!user || (user.role !== "admin" && user.role !== "manager"))
    throw new Error("Unauthorized");

  const users = await readUsers();
  const id = Date.now();
  const created: User = { ...newUser, id };
  users.push(created);
  await writeUsers(users);
  return created;
}

export async function updateUser(
  id: number,
  updated: Partial<User>
): Promise<User> {
  await wait(WAIT);
  const user = await getUserFromCookies();
  if (!user || user.role !== "admin") throw new Error("Unauthorized");

  const users = await readUsers();
  const index = users.findIndex((u: Partial<User>) => u.id === id);
  if (index === -1) throw new Error("User not found");
  users[index] = { ...users[index], ...updated };
  await writeUsers(users);
  return users[index];
}

export async function deleteUser(id: number): Promise<User> {
  await wait(WAIT);
  const user = await getUserFromCookies();
  if (!user || user.role !== "admin") throw new Error("Unauthorized");

  const users = await readUsers();
  const index = users.findIndex((u: Partial<User>) => u.id === id);
  if (index === -1) throw new Error("User not found");
  const removed = users[index];
  users.splice(index, 1);
  await writeUsers(users);
  return removed;
}
