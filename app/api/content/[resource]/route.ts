import { NextResponse } from "next/server";
import {
  authorizeResource,
  categoryData,
  downloadData,
  galleryData,
  isResource,
  listResource,
  logContentActivity,
  productData,
  blogData,
  settingsData,
  productTableRows,
} from "@/lib/api/content";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ resource: string }> }
) {
  const { resource: raw } = await params;

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

    const url = new URL(request.url);
    const activeOnly =
      url.searchParams.get("active") === "true";

    const data = await listResource(raw, activeOnly);

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
      `GET /api/content/${raw} failed:`,
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
        data: [],
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ resource: string }> }
) {
  const { resource: raw } = await params;

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
    const body =
      (await request.json()) as Record<string, unknown>;

    let created: unknown;

    switch (raw) {
      case "products": {
        const rows = productTableRows(body);
        created = await prisma.$transaction(async (tx) => {
          const product = await tx.product.create({
            data: productData(body),
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
            where: { id: product.id },
            include: { tableRows: { orderBy: { displayOrder: "asc" } } },
          });
        });
        break;
      }

      case "categories":
        created = await prisma.category.create({
          data: categoryData(body),
        });
        break;

      case "dealers": {
        /*
         * Build dealer data explicitly instead of relying on
         * dealerData(), because dealerData() is currently typed
         * too narrowly and only exposes the status field.
         */
        const dealerStatus = text(body.status);

        const validStatuses = [
          "active",
          "new",
          "contacted",
          "rejected",
        ] as const;

        type DealerStatus = (typeof validStatuses)[number];

        const status: DealerStatus = validStatuses.includes(
          dealerStatus as DealerStatus
        )
          ? (dealerStatus as DealerStatus)
          : "new";

        created = await prisma.dealer.create({
          data: {
            dealerName: text(body.dealerName),
            shopName: text(body.shopName),
            mobile: text(body.mobile),

            ownerName: text(body.ownerName),
            whatsapp: text(body.whatsapp),
            email: text(body.email),
            gstNumber: text(body.gstNumber),
            address: text(body.address),
            city: text(body.city),
            state: text(body.state),
            pincode: text(body.pincode),
            dealerType: text(body.dealerType),
            existingBrands: text(body.existingBrands),
            monthlyPurchase: text(body.monthlyPurchase),
            interestedProducts: text(
              body.interestedProducts
            ),

            salesRepresentative: text(
              body.salesRepresentative
            ),

            status,
            notes: text(body.notes),
          },
        });

        break;
      }

      case "downloads":
        created = await prisma.download.create({
          data: downloadData(body),
        });
        break;

      case "gallery":
        created = await prisma.galleryItem.create({
          data: galleryData(body),
        });
        break;

      case "blogs":
        created = await prisma.blogPost.create({
          data: blogData(body),
        });
        break;

      case "settings":
        created = await prisma.websiteSettings.upsert({
          where: {
            id: "website",
          },
          update: settingsData(body) as any,
          create: settingsData(body) as any,
        });
        break;
    }

    await logContentActivity(
      verified.admin,
      `${raw.toUpperCase()}_CREATED`,
      `${verified.admin.email} created ${raw}`
    );

    return NextResponse.json(
      {
        success: true,
        data: created,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      `POST /api/content/${raw} failed:`,
      error
    );

    const message =
      error instanceof Error &&
      error.message.includes("Unique constraint")
        ? "A record with the same unique value already exists."
        : "Failed to save data";

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