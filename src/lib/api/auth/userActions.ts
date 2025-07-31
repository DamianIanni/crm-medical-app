"use client";
import axios from "axios";

export async function loginWithCredentials(credentials: {
  email: string;
  password: string;
}): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  try {
    await axios.post("/api/login", credentials, {
      withCredentials: true,
    });
  } catch (error) {
    console.log("Login error", error);
    throw error;
  }
}

export async function userDoesLogout(): Promise<void> {
  try {
    await axios.post("/api/logout", null, {
      withCredentials: true,
    });
  } catch (error) {
    console.log("Logout error", error);
  }
}

export async function getCurrentUser() {
  try {
    const res = await fetch("/api/me", {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Unauthorized");

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}
