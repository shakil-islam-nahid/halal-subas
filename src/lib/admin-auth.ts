import { cookies } from "next/headers";
import { createHash } from "node:crypto";

const cookieName = "halal-subas-admin";

function sessionValue() {
  const secret = process.env.ADMIN_SESSION_SECRET ?? "change-me";
  const email = process.env.ADMIN_EMAIL ?? "";
  return createHash("sha256").update(`${email}:${secret}`).digest("hex");
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(cookieName, sessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get(cookieName)?.value === sessionValue();
}
