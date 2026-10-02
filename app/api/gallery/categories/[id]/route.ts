import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth/verifyAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const verified = await requirePermission(request, "gallery.manage");

  if ("error" in verified) {
    return verified.error;
  }

  const { id } = await params;

  try {
    const body = (await request.json()) as Record<string, unknown>;

    const name = text(body.name);

    if (!name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    const category = await prisma.galleryCategory.update({
      where: { id },
      data: {
        name,
        slug: text(body.slug) || slugify(name),
        description: text(body.description),
      },
    });

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update gallery category" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const verified = await requirePermission(request, "gallery.manage");

  if ("error" in verified) {
    return verified.error;
  }

  const { id } = await params;

  try {
    const count = await prisma.galleryItem.count({
      where: { categoryId: id },
    });

    if (count > 0) {
      return NextResponse.json(
        {
          error: `This category contains ${count} media item${
            count === 1 ? "" : "s"
          }. Move or remove those items before deleting the category.`,
        },
        { status: 409 }
      );
    }

    await prisma.galleryCategory.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete gallery category" },
      { status: 400 }
    );
  }
}