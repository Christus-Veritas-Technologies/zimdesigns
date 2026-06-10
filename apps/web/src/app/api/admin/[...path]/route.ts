import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Server-only constants — never shipped to the client bundle
const ADMIN_COOKIE = "zd_admin";
const ADMIN_TOKEN = "zdtok-9kq27p-v1"; // must match middleware.ts + actions.ts
const ADMIN_API_KEY = "zdapikey-8rx42m-v1"; // must match server/routes/admin.ts
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3001";

async function proxy(request: NextRequest, path: string[]): Promise<NextResponse> {
  const cookieStore = await cookies();
  if (cookieStore.get(ADMIN_COOKIE)?.value !== ADMIN_TOKEN) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const upstream = `${SERVER_URL}/api/admin/${path.join("/")}${request.nextUrl.search}`;
  const body = request.method !== "GET" && request.method !== "HEAD"
    ? await request.text()
    : undefined;

  // Forward the user's own access token so Hono knows the real caller identity
  const userAuth = request.headers.get("Authorization");

  try {
    const res = await fetch(upstream, {
      method: request.method,
      headers: {
        "Content-Type": "application/json",
        "X-Admin-Key": ADMIN_API_KEY,
        // Include user JWT if present — Hono will resolve real userId from it
        ...(userAuth ? { Authorization: userAuth } : {}),
      },
      body,
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[admin-proxy]", err);
    return NextResponse.json({ message: "Upstream error" }, { status: 502 });
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path);
}
export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path);
}
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path);
}
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path);
}
