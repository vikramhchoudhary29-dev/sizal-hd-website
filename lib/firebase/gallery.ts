import { prisma } from "@/lib/prisma";
import {
  GalleryItem,
  GalleryMediaType,
} from "@/types/gallery";

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const items = await prisma.galleryItem.findMany({
    where: {
      status: "active",
    },
    orderBy: [
      {
        displayOrder: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  return items.map((item) => ({
    ...item,
    mediaType: item.mediaType as GalleryMediaType,
  }));
}