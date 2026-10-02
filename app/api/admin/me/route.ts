import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth/verifyAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const verified = await requirePermission(request, "dashboard.view");

  if ("error" in verified) {
    return verified.error;
  }

  return NextResponse.json({
    admin: {
      uid: verified.admin.uid,
      name: verified.admin.name,
      email: verified.admin.email,
      role: verified.admin.role,
      status: verified.admin.status,
    },
  });
}