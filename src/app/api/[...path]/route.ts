import type { NextRequest } from "next/server";

// Este es tu "puente".
export async function handler(req: NextRequest) {
  const path = req.nextUrl.pathname.replace("/api/", "");
  const backendUrl = `${process.env.BASE_URL}/${path}`;

  const response = await fetch(backendUrl, {
    method: req.method,
    headers: req.headers,
    body: req.method !== "GET" && req.method !== "HEAD" ? req.body : null,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    duplex: "half", // Required to resend the body
  });

  return response;
}

export {
  handler as GET,
  handler as POST,
  handler as PATCH,
  handler as DELETE,
  handler as PUT,
};
