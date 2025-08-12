"use client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DataUserFilter } from "./schemas/memberSchema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function filterSelfUser(data: DataUserFilter[], userId: string) {
  return data && data.filter((user) => user.user_id !== userId);
}

export const getEntitySessionStorage = (key: string) => {
  const data = JSON.parse(sessionStorage.getItem(key)!);
  return data;
};

export const setEntitySessionStorage = (key: string, value: string) => {
  sessionStorage.setItem(key, value);
};

export const removeEntitySessionStorage = (key: string) => {
  sessionStorage.removeItem(key);
};
