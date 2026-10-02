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
    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";
    const role = body.role as string;

    if (!uid || !name || !role) {
      return NextResponse.json(
        { error: "UID, name and role are required" },
        { status: 400 }
      );
    }

    if (
      !["owner", "super_admin", "admin", "editor"].includes(role)
    ) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    if (
      uid === verified.admin.uid &&
      role !== verified.admin.role
    ) {
      return NextResponse.json(
        { error: "You cannot change your own role." },
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

    if (target.role === "owner" && role !== "owner") {
      const owners = await prisma.admin.count({
        where: {
          role: "owner",
          status: "active",
        },
      });

      if (owners <= 1) {
        return NextResponse.json(
          { error: "Cannot remove the last Owner role." },
          { status: 400 }
        );
      }
    }

    await adminAuth.updateUser(uid, {
      displayName: name,
    });

    const admin = await prisma.admin.update({
      where: { uid },
      data: {
        name,
        role: role as
          | "owner"
          | "super_admin"
          | "admin"
          | "editor",
      },
    });

    await logActivity({
      action: "ADMIN_UPDATED",
      performedBy: verified.admin.uid,
      performedByEmail: verified.admin.email,
      targetUid: uid,
      targetEmail: target.email,
      message: `${verified.admin.email} updated admin ${uid}`,
    });

    return NextResponse.json({
      success: true,
      admin,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update admin" },
      { status: 500 }
    );
  }
}