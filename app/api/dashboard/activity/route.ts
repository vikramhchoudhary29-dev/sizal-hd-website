import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth/verifyAdmin";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const verified = await requirePermission(
    request,
    "dashboard.view"
  );

  if ("error" in verified) {
    return verified.error;
  }

  try {
    const logs = await prisma.activityLog.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    return NextResponse.json({
      logs,
    });
  } catch (error) {
    console.error(
      "GET /api/dashboard/activity failed:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to load activity logs",
      },
      {
        status: 500,
      }
    );
  }
}