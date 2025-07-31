"use server";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/api/jwtUtil";

// export const dynamic = "force-dynamic";

export async function getUserFromCookies() {
  try {
    const cookiesStore = await cookies();
    const token = cookiesStore.get("token")?.value;
    const user = token ? await verifyJWT(token) : null;
    return user;
  } catch (error) {
    console.log(error);
  }
}
