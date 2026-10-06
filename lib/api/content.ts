import { NextResponse } from "next/server";
import { requirePermission, type VerifiedAdmin } from "@/lib/auth/verifyAdmin";
import { prisma } from "@/lib/prisma";

export const RESOURCE_PERMISSIONS = {
  products: "products.manage",
  categories: "categories.manage",
  dealers: "dealers.view",
  downloads: "downloads.manage",
  gallery: "gallery.manage",
  blogs: "blogs.manage",
  settings: "settings.manage",
} as const;

export type Resource = keyof typeof RESOURCE_PERMISSIONS;

export function isResource(value: string): value is Resource {
  return value in RESOURCE_PERMISSIONS;
}

export async function authorizeResource(request: Request, resource: Resource) {
  const permission = RESOURCE_PERMISSIONS[resource];
  return requirePermission(request, permission);
}

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function bool(value: unknown) {
  return value === true || value === "true" || value === "on";
}

function enumValue<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T
) {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

export async function listResource(resource: Resource, activeOnly = false) {
  switch (resource) {
    case "products":
      return prisma.product.findMany({
        where: activeOnly ? { status: "active" } : undefined,
        include: { tableRows: { orderBy: { displayOrder: "asc" } } },
        orderBy: { createdAt: "desc" },
      });

    case "categories":
      return prisma.category.findMany({
        where: activeOnly ? { status: "active" } : undefined,
        orderBy: { createdAt: "desc" },
      });

    case "dealers":
      return prisma.dealer.findMany({
        orderBy: { createdAt: "desc" },
      });

    case "downloads":
      return prisma.download.findMany({
        where: activeOnly ? { status: "active" } : undefined,
        orderBy: { createdAt: "desc" },
      });

    case "gallery":
      return prisma.galleryItem.findMany({
        where: activeOnly ? { status: "active" } : undefined,
        include: { galleryCategory: true },
        orderBy: [
          { displayOrder: "asc" },
          { createdAt: "desc" },
        ],
      });

    case "blogs":
      return prisma.blogPost.findMany({
        where: activeOnly ? { status: "active" } : undefined,
        orderBy: { createdAt: "desc" },
      });

    case "settings": {
      const item = await prisma.websiteSettings.findUnique({
        where: { id: "website" },
      });

      return item ? [item] : [];
    }
  }
}

export async function getResource(resource: Resource, id: string) {
  switch (resource) {
    case "products":
      return prisma.product.findUnique({
        where: { id },
        include: { tableRows: { orderBy: { displayOrder: "asc" } } },
      });

    case "categories":
      return prisma.category.findUnique({ where: { id } });

    case "dealers":
      return prisma.dealer.findUnique({ where: { id } });

    case "downloads":
      return prisma.download.findUnique({ where: { id } });

    case "gallery":
      return prisma.galleryItem.findUnique({
        where: { id },
        include: { galleryCategory: true },
      });

    case "blogs":
      return prisma.blogPost.findUnique({ where: { id } });

    case "settings":
      return prisma.websiteSettings.findUnique({
        where: { id: id || "website" },
      });
  }
}

export type ProductTableRowInput = {
  id?: string;
  indexValue?: unknown;
  productName?: unknown;
  dia?: unknown;
  coatingColour?: unknown;
  description?: unknown;
  displayOrder?: unknown;
};

export function productTableRows(body: Record<string, unknown>) {
  const raw = body.tableRows;
  if (!raw) return [];

  let rows: unknown = raw;
  if (typeof raw === "string") {
    try {
      rows = JSON.parse(raw);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(rows)) return [];

  return rows.map((row, index) => {
    const item = (row || {}) as ProductTableRowInput;
    const displayOrder = Number(item.displayOrder);

    return {
      indexValue: cleanText(item.indexValue),
      productName: cleanText(item.productName),
      dia: cleanText(item.dia),
      coatingColour: cleanText(item.coatingColour),
      description: cleanText(item.description),
      displayOrder: Number.isFinite(displayOrder) ? displayOrder : index,
    };
  }).filter((row) =>
    row.indexValue ||
    row.productName ||
    row.dia ||
    row.coatingColour ||
    row.description
  );
}

export function productData(body: Record<string, unknown>) {
  return {
    name: cleanText(body.name),
    code: cleanText(body.code),
    category: cleanText(body.category),
    shortDescription: cleanText(body.shortDescription),
    fullDescription: cleanText(body.fullDescription),
    lensIndex: cleanText(body.lensIndex),
    coating: cleanText(body.coating),
    imageUrl: cleanText(body.imageUrl),
    coverImageUrl: cleanText(body.coverImageUrl),
    videoUrl: cleanText(body.videoUrl),
    pdfUrl: cleanText(body.pdfUrl),
    status: enumValue(
      body.status,
      ["active", "draft"] as const,
      "draft"
    ),
    featured: bool(body.featured),
    seoTitle: cleanText(body.seoTitle),
    seoDescription: cleanText(body.seoDescription),
  };
}

export function categoryData(body: Record<string, unknown>) {
  const name = cleanText(body.name);

  const slug =
    cleanText(body.slug) ||
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  return {
    name,
    slug,
    description: cleanText(body.description),
    status: enumValue(
      body.status,
      ["active", "draft"] as const,
      "active"
    ),
  };
}

export function dealerData(body: Record<string, unknown>) {
  const fields = [
    "dealerName",
    "shopName",
    "ownerName",
    "mobile",
    "whatsapp",
    "email",
    "gstNumber",
    "address",
    "city",
    "state",
    "pincode",
    "dealerType",
    "existingBrands",
    "monthlyPurchase",
    "interestedProducts",
    "salesRepresentative",
    "notes",
  ] as const;

  const data: Record<string, string> = {};

  for (const field of fields) {
    data[field] = cleanText(body[field]);
  }

  return {
    ...data,
    status: enumValue(
      body.status,
      ["new", "contacted", "active", "rejected"] as const,
      "new"
    ),
  };
}

export function blogData(body: Record<string, unknown>) {
  const title = cleanText(body.title);

  const slug =
    cleanText(body.slug) ||
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  return {
    title,
    slug,
    shortDescription: cleanText(body.shortDescription),
    content: cleanText(body.content),
    imageUrl: cleanText(body.imageUrl),
    author: cleanText(body.author),
    category: cleanText(body.category),
    status: enumValue(
      body.status,
      ["active", "draft"] as const,
      "draft"
    ),
    featured: bool(body.featured),
    seoTitle: cleanText(body.seoTitle),
    seoDescription: cleanText(body.seoDescription),
  };
}

export function downloadData(body: Record<string, unknown>) {
  return {
    title: cleanText(body.title),
    type: cleanText(body.type),
    category: cleanText(body.category),
    fileUrl: cleanText(body.fileUrl),
    status: enumValue(
      body.status,
      ["active", "draft"] as const,
      "active"
    ),
    featured: bool(body.featured),
  };
}

export function galleryData(body: Record<string, unknown>) {
  const order = Number(body.displayOrder);

  const mediaType = enumValue(
    body.mediaType,
    ["image", "video"] as const,
    "image"
  );

  return {
    title: cleanText(body.title),
    category: cleanText(body.category),
    description: cleanText(body.description),
    imageUrl: cleanText(body.imageUrl || body.mediaUrl),
    mediaType,
    displayOrder: Number.isFinite(order) ? order : 0,
    categoryId: cleanText(body.categoryId) || null,
    status: enumValue(
      body.status,
      ["active", "draft"] as const,
      "active"
    ),
    featured: bool(body.featured),
  };
}

/**
 * Website settings
 *
 * IMPORTANT:
 * companyPhone  = calling number
 * whatsappNumber = number displayed for WhatsApp Orders
 * whatsappUrl    = actual WhatsApp destination URL used by buttons
 *
 * The old galleryHero* fields have intentionally been removed
 * because they no longer exist in the WebsiteSettings Prisma model.
 */
export function settingsData(body: Record<string, unknown>) {
  const fields = [
    "heroTitle",
    "heroHighlight",
    "heroSubtitle",
    "primaryButtonText",
    "primaryButtonUrl",
    "secondaryButtonText",
    "secondaryButtonUrl",
    "galleryHeroTitle",
    "galleryHeroHighlight",
    "galleryHeroSubtitle",
    "companyPhone",
    "whatsappNumber",
    "companyEmail",
    "companyAddress",
    "instagramUrl",
    "facebookUrl",
    "whatsappUrl",
    "seoTitle",
    "seoDescription",
  ] as const;

  const data: Record<string, string> = {
    id: "website",
  };

  for (const field of fields) {
    data[field] = cleanText(body[field]);
  }

  return data;
}

export async function logContentActivity(
  admin: VerifiedAdmin,
  action: string,
  message: string,
  targetId?: string
) {
  await prisma.activityLog.create({
    data: {
      action,
      message,
      performedBy: admin.uid,
      performedByEmail: admin.email,
      targetUid: targetId || null,
    },
  });
}

export function serverError(message = "Something went wrong") {
  return NextResponse.json(
    { error: message },
    { status: 500 }
  );
}