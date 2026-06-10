"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Neither the password nor the session token is ever bundled into client JS —
// this file is a Server Action module and runs exclusively on the server.
const ADMIN_PASSWORD = "exyro45610y2627291";
const ADMIN_COOKIE = "zd_admin";
const ADMIN_TOKEN = "zdtok-9kq27p-v1"; // must match middleware.ts

export async function adminLogin(
  _prev: { error?: string } | undefined,
  formData: FormData,
): Promise<{ error?: string }> {
  const password = formData.get("password") as string;
  if (password !== ADMIN_PASSWORD) {
    return { error: "Incorrect password" };
  }
  (await cookies()).set(ADMIN_COOKIE, ADMIN_TOKEN, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
  redirect("/admin");
}

export async function adminLogout(): Promise<void> {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin/login");
}
