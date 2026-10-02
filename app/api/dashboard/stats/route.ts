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
    const [
      products,
      categories,
      dealers,
      downloads,
      gallery,
      blogs,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.dealer.count(),
      prisma.download.count(),
      prisma.galleryItem.count(),
      prisma.blogPost.count(),
    ]);

    return NextResponse.json({
      counts: {
        products,
        categories,
        dealers,
        downloads,
        gallery,
        blogs,
      },
    });
  } catch (error) {
    console.error(
      "GET /api/dashboard/stats failed:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to load dashboard statistics",
      },
      { status: 500 }
    );
  }
}