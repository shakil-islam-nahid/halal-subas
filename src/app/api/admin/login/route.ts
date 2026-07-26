import { NextResponse } from "next/server";
import { setAdminSession } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (
    email !== String(process.env.ADMIN_EMAIL ?? "").toLowerCase() ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
  }

  await setAdminSession();
  return NextResponse.json({ ok: true });
}
