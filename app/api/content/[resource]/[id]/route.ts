import { NextResponse } from "next/server";
import {
  authorizeResource,
  categoryData,
  dealerData,
  downloadData,
  galleryData,
  getResource,
  isResource,
  logContentActivity,
  productData,
  productTableRows,
  blogData,
  settingsData,
} from "@/lib/api/content";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ resource: string; id: string }> }
) {
  const { resource: raw, id } = await params;

  if (!isResource(raw)) {
    return NextResponse.json(
      { error: "Unknown resource" },
      { status: 404 }
    );
  }

  try {
    if (raw === "dealers") {
      const verified = await authorizeResource(request, raw);

      if ("error" in verified) {
        return verified.error;
      }
    }

    const data = await getResource(raw, id);

    if (!data) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { data },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error(
      `GET /api/content/${raw}/${id} failed:`,
      error
    );

    const detail =
      error instanceof Error
        ? error.message
        : "Unknown server error";

    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? detail
            : "Failed to load data",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ resource: string; id: string }> }
) {
  const { resource: raw, id } = await params;

  if (!isResource(raw)) {
    return NextResponse.json(
      { error: "Unknown resource" },
      { status: 404 }
    );
  }

  const verified = await authorizeResource(request, raw);

  if ("error" in verified) {
    return verified.error;
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;

    let updated: unknown;

    switch (raw) {
      case "products": {
        const rows = productTableRows(body);
        updated = await prisma.$transaction(async (tx) => {
          const product = await tx.product.update({
            where: { id },
            data: productData(body),
          });

          await tx.productTableRow.deleteMany({
            where: { productId: id },
          });

          if (rows.length) {
            await tx.productTableRow.createMany({
              data: rows.map((row) => ({
                ...row,
                productId: product.id,
              })),
            });
          }

          return tx.product.findUnique({
            where: { id },
            include: { tableRows: { orderBy: { displayOrder: "asc" } } },
          });
        });
        break;
      }

      case "categories":
        updated = await prisma.category.update({
          where: { id },
          data: categoryData(body),
        });
        break;

      case "dealers":
        updated = await prisma.dealer.update({
          where: { id },
          data: dealerData(body),
        });
        break;

      case "downloads":
        updated = await prisma.download.update({
          where: { id },
          data: downloadData(body),
        });
        break;

      case "gallery":
        updated = await prisma.galleryItem.update({
          where: { id },
          data: galleryData(body),
        });
        break;

      case "blogs":
        updated = await prisma.blogPost.update({
          where: { id },
          data: blogData(body),
        });
        break;

      case "settings":
        updated = await prisma.websiteSettings.upsert({
          where: { id: "website" },
          update: settingsData(body) as any,
          create: settingsData(body) as any,
        });
        break;
    }

    await logContentActivity(
      verified.admin,
      `${raw.toUpperCase()}_UPDATED`,
      `${verified.admin.email} updated ${raw} ${id}`,
      id
    );

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error(
      `PATCH /api/content/${raw}/${id} failed:`,
      error
    );

    return NextResponse.json(
      { error: "Failed to update data" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ resource: string; id: string }> }
) {
  const { resource: raw, id } = await params;

  if (!isResource(raw)) {
    return NextResponse.json(
      { error: "Unknown resource" },
      { status: 404 }
    );
  }

  const verified = await authorizeResource(request, raw);

  if ("error" in verified) {
    return verified.error;
  }

  if (raw === "settings") {
    return NextResponse.json(
      { error: "Settings cannot be deleted" },
      { status: 400 }
    );
  }

  try {
    switch (raw) {
      case "products":
        await prisma.product.delete({
          where: { id },
        });
        break;

      case "categories":
        await prisma.category.delete({
          where: { id },
        });
        break;

      case "dealers":
        await prisma.dealer.delete({
          where: { id },
        });
        break;

      case "downloads":
        await prisma.download.delete({
          where: { id },
        });
        break;

      case "gallery":
        await prisma.galleryItem.delete({
          where: { id },
        });
        break;

      case "blogs":
        await prisma.blogPost.delete({
          where: { id },
        });
        break;
    }

    await logContentActivity(
      verified.admin,
      `${raw.toUpperCase()}_DELETED`,
      `${verified.admin.email} deleted ${raw} ${id}`,
      id
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      `DELETE /api/content/${raw}/${id} failed:`,
      error
    );

    return NextResponse.json(
      { error: "Failed to delete data" },
      { status: 400 }
    );
  }
}