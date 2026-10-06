import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { requirePermission } from "@/lib/auth/verifyAdmin";
import { logActivity } from "@/lib/activity/logActivity";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const verified = await requirePermission(request, "admins.update");

  if ("error" in verified) {
    return verified.error;
  }

  try {
    const { email } = await request.json();

    if (typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const link = await getAuth().generatePasswordResetLink(
      normalizedEmail
    );

    await logActivity({
      action: "ADMIN_PASSWORD_RESET_LINK_CREATED",
      performedBy: verified.admin.uid,
      performedByEmail: verified.admin.email,
      targetEmail: normalizedEmail,
      message: `${verified.admin.email} created a password reset link for ${normalizedEmail}`,
    });

    return NextResponse.json({
      success: true,
      resetLink: link,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate password reset link" },
      { status: 500 }
    );
  }
}