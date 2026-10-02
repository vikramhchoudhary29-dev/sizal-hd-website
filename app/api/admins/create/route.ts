import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { requirePermission } from "@/lib/auth/verifyAdmin";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const verified = await requirePermission(request, "admins.create");

  if ("error" in verified) {
    return verified.error;
  }

  try {
    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const role =
      typeof body.role === "string"
        ? body.role
        : "admin";

    if (!name || !email) {
      return NextResponse.json(
        {
          error: "Name and email are required.",
        },
        { status: 400 }
      );
    }

    const existing = await prisma.admin.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        {
          error: "An admin with this email already exists.",
        },
        { status: 409 }
      );
    }

    const allowedRoles = [
      "owner",
      "super_admin",
      "admin",
      "editor",
    ] as const;

    if (
      !allowedRoles.includes(
        role as (typeof allowedRoles)[number]
      )
    ) {
      return NextResponse.json(
        {
          error: "Invalid admin role.",
        },
        { status: 400 }
      );
    }

    // Admin.uid is the primary key and is required by Prisma.
    // Generate a unique UID for the new admin.
    const uid = randomUUID();

    const created = await prisma.admin.create({
      data: {
        uid,
        name,
        email,
        role: role as (typeof allowedRoles)[number],
        status: "active",
        createdBy: verified.admin.uid,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "ADMIN_CREATED",
        message: `${verified.admin.email} created admin ${email}`,
        performedBy: verified.admin.uid,
        performedByEmail: verified.admin.email,
        targetUid: created.uid,
        targetEmail: created.email,
      },
    });

    return NextResponse.json(
      {
        success: true,
        admin: {
          uid: created.uid,
          name: created.name,
          email: created.email,
          role: created.role,
          status: created.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/admins/create failed:", error);

    if (
      error instanceof Error &&
      error.message.includes("Unique constraint")
    ) {
      return NextResponse.json(
        {
          error: "An admin with this email already exists.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to create admin.",
      },
      { status: 500 }
    );
  }
}