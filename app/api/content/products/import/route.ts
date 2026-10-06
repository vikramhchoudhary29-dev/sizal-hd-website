import { NextResponse } from "next/server";
import { authorizeResource } from "@/lib/api/content";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type ProductImportRow = {
  name?: unknown;
  code?: unknown;
  category?: unknown;
  shortDescription?: unknown;
  fullDescription?: unknown;
  lensIndex?: unknown;
  coating?: unknown;
  imageUrl?: unknown;
  coverImageUrl?: unknown;
  videoUrl?: unknown;
  pdfUrl?: unknown;
  status?: unknown;
  featured?: unknown;
  seoTitle?: unknown;
  seoDescription?: unknown;
};

type TableImportRow = {
  productCode?: unknown;
  index?: unknown;
  productName?: unknown;
  dia?: unknown;
  coatingColour?: unknown;
  description?: unknown;
  displayOrder?: unknown;
};

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : value == null ? "" : String(value).trim();
}

function bool(value: unknown) {
  if (typeof value === "boolean") return value;
  return ["true", "yes", "1", "on", "y"].includes(text(value).toLowerCase());
}

function status(value: unknown) {
  return text(value).toLowerCase() === "draft" ? "draft" : "active";
}

function normalizeProduct(row: ProductImportRow) {
  return {
    name: text(row.name),
    code: text(row.code),
    category: text(row.category),
    shortDescription: text(row.shortDescription),
    fullDescription: text(row.fullDescription),
    lensIndex: text(row.lensIndex),
    coating: text(row.coating),
    imageUrl: text(row.imageUrl),
    coverImageUrl: text(row.coverImageUrl),
    videoUrl: text(row.videoUrl),
    pdfUrl: text(row.pdfUrl),
    status: status(row.status),
    featured: bool(row.featured),
    seoTitle: text(row.seoTitle),
    seoDescription: text(row.seoDescription),
  } as const;
}

export async function POST(request: Request) {
  const verified = await authorizeResource(request, "products");
  if ("error" in verified) return verified.error;

  try {
    const body = (await request.json()) as {
      products?: ProductImportRow[];
      tableRows?: TableImportRow[];
    };

    const products = Array.isArray(body.products) ? body.products : [];
    const tableRows = Array.isArray(body.tableRows) ? body.tableRows : [];

    if (!products.length) {
      return NextResponse.json(
        { error: "No product rows were found in the import." },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      let created = 0;
      let updated = 0;
      let rowsImported = 0;

      const productByCode = new Map<string, string>();

      for (const raw of products) {
        const data = normalizeProduct(raw);
        if (!data.name || !data.code) continue;

        const existing = await tx.product.findFirst({
          where: { code: data.code },
          select: { id: true },
        });

        if (existing) {
          await tx.product.update({ where: { id: existing.id }, data });
          productByCode.set(data.code.toLowerCase(), existing.id);
          updated += 1;
        } else {
          const product = await tx.product.create({ data });
          productByCode.set(data.code.toLowerCase(), product.id);
          created += 1;
        }
      }

      const rowsByProduct = new Map<string, TableImportRow[]>();
      for (const row of tableRows) {
        const code = text(row.productCode).toLowerCase();
        if (!code) continue;
        const bucket = rowsByProduct.get(code) || [];
        bucket.push(row);
        rowsByProduct.set(code, bucket);
      }

      for (const [code, rows] of rowsByProduct) {
        const productId = productByCode.get(code);
        if (!productId) continue;

        await tx.productTableRow.deleteMany({ where: { productId } });

        const validRows = rows
          .map((row, index) => {
            const order = Number(row.displayOrder);
            return {
              productId,
              indexValue: text(row.index),
              productName: text(row.productName),
              dia: text(row.dia),
              coatingColour: text(row.coatingColour),
              description: text(row.description),
              displayOrder: Number.isFinite(order) ? order : index,
            };
          })
          .filter((row) =>
            row.indexValue || row.productName || row.dia || row.coatingColour || row.description
          );

        if (validRows.length) {
          await tx.productTableRow.createMany({ data: validRows });
          rowsImported += validRows.length;
        }
      }

      return { created, updated, rowsImported };
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("POST /api/content/products/import failed:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Product import failed",
      },
      { status: 500 }
    );
  }
}
