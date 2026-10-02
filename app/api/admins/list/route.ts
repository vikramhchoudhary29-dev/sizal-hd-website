import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth/verifyAdmin";
import { adminAuth } from "@/lib/firebase/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const verified = await requirePermission(request, "admins.view");

  if ("error" in verified) {
    return verified.error;
  }

  try {
    const admins = await prisma.admin.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    const enriched = await Promise.all(
      admins.map(async (admin) => {
        let firebaseUser = null;

        try {
          firebaseUser = await adminAuth.getUser(admin.uid);
        } catch {
          firebaseUser = null;
        }

        return {
          uid: admin.uid,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          status: admin.status,
          createdBy: admin.createdBy,
          createdAt: admin.createdAt,
          updatedAt: admin.updatedAt,
          firebaseDisabled: firebaseUser?.disabled ?? null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      admins: enriched,
    });
  } catch (error) {
    console.error("GET /api/admins/list failed:", error);

    return NextResponse.json(
      {
        error: "Failed to load admins.",
      },
      { status: 500 }
    );
  }
}