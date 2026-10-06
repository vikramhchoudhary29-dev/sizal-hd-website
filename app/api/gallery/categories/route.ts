import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth/verifyAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET() {
  try {
    const categories = await prisma.galleryCategory.findMany({
      where: {
        status: "active",
      },
      include: {
        _count: {
          select: {
            items: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(
      {
        data: categories,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "GET /api/gallery/categories failed:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to load gallery categories",
        data: [],
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  const verified = await requirePermission(
    request,
    "gallery.manage"
  );

  if ("error" in verified) {
    return verified.error;
  }

  try {
    const body = (await request.json()) as Record<
      string,
      unknown
    >;

    const name = text(body.name);

    if (!name) {
      return NextResponse.json(
        {
          error: "Category name is required",
        },
        {
          status: 400,
        }
      );
    }

    const slug = text(body.slug) || slugify(name);

    const category = await prisma.galleryCategory.create({
      data: {
        name,
        slug,
        description: text(body.description),
        status: "active",
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: category,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    const message =
      error instanceof Error &&
      error.message.includes("Unique constraint")
        ? "A gallery category with this name or slug already exists."
        : "Failed to create gallery category";

    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 400,
      }
    );
  }
}