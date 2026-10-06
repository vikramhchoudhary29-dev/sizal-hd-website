import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/firebaseAdmin";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth/verifyAdmin";
import { logActivity } from "@/lib/activity/logActivity";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const verified = await requirePermission(request, "admins.update");

  if ("error" in verified) {
    return verified.error;
  }

  try {
    const body = await request.json();

    const uid = body.uid as string;
    const disabled = Boolean(body.disabled);

    if (!uid) {
      return NextResponse.json(
        { error: "Admin UID is required" },
        { status: 400 }
      );
    }

    if (uid === verified.admin.uid) {
      return NextResponse.json(
        { error: "You cannot disable your own account." },
        { status: 400 }
      );
    }

    const target = await prisma.admin.findUnique({
      where: { uid },
    });

    if (!target) {
      return NextResponse.json(
        { error: "Admin not found." },
        { status: 404 }
      );
    }

    if (disabled && target.role === "owner") {
      const owners = await prisma.admin.count({
        where: {
          role: "owner",
          status: "active",
        },
      });

      if (owners <= 1) {
        return NextResponse.json(
          { error: "Cannot disable the last Owner." },
          { status: 400 }
        );
      }
    }

    await adminAuth.updateUser(uid, {
      disabled,
    });

    await prisma.admin.update({
      where: { uid },
      data: {
        status: disabled ? "disabled" : "active",
      },
    });

    await logActivity({
      action: disabled ? "ADMIN_DISABLED" : "ADMIN_ENABLED",
      performedBy: verified.admin.uid,
      performedByEmail: verified.admin.email,
      targetUid: uid,
      targetEmail: target.email,
      message: `${verified.admin.email} ${
        disabled ? "disabled" : "enabled"
      } admin ${uid}`,
    });

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update admin status" },
      { status: 500 }
    );
  }
}