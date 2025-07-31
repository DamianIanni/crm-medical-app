/* eslint-disable @typescript-eslint/no-explicit-any */

import { jwtVerify } from "jose";

import { SignJWT } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "my-super-secret-clinical-aisel-client-jwt-key"
);

export async function signJWT(
  payload: Record<string, unknown>
): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(SECRET);
}

export async function verifyJWT(token: string): Promise<any | null> {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(
        process.env.JWT_SECRET ||
          "my-super-secret-clinical-aisel-client-jwt-key"
      )
    );
    return payload;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
}
