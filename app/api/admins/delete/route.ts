import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/firebaseAdmin";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth/verifyAdmin";
import { logActivity } from "@/lib/activity/logActivity";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const verified = await requirePermission(request, "admins.delete");

  if ("error" in verified) {
    return verified.error;
  }

  try {
    const { uid } = await request.json();

    if (!uid) {
      return NextResponse.json(
        { error: "Admin UID is required" },
        { status: 400 }
      );
    }

    if (uid === verified.admin.uid) {
      return NextResponse.json(
        { error: "You cannot delete your own account." },
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

    if (target.role === "owner") {
      const owners = await prisma.admin.count({
        where: {
          role: "owner",
          status: "active",
        },
      });

      if (owners <= 1) {
        return NextResponse.json(
          { error: "Cannot delete the last Owner." },
          { status: 400 }
        );
      }
    }

    await adminAuth.deleteUser(uid);

    await prisma.admin.delete({
      where: { uid },
    });

    await logActivity({
      action: "ADMIN_DELETED",
      performedBy: verified.admin.uid,
      performedByEmail: verified.admin.email,
      targetUid: uid,
      targetEmail: target.email,
      message: `${verified.admin.email} deleted admin ${uid}`,
    });

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete admin" },
      { status: 500 }
    );
  }
}