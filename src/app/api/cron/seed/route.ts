import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // 1. Verifica que la llamada venga de Vercel (usando el secreto)
  const { searchParams } = new URL(request.url);
  if (searchParams.get("secret") !== process.env.CRON_SECRET) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // 2. Si es válido, AHORA SÍ HACE LA PETICIÓN a tu backend
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cron/seed`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CRON_KEY_SECRET}`,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return new NextResponse(`Error triggering seed job ${error}`, {
      status: 500,
    });
  }
}
