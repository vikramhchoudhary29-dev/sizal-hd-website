import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const productCount = await prisma.product.count({
      where: { status: "active" },
    });

    return NextResponse.json(
      {
        ok: true,
        database: "connected",
        activeProducts: productCount,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      { ok: false, database: "unavailable" },
      { status: 503 }
    );
  }
}
