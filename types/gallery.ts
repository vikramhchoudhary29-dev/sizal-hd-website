export type GalleryMediaType = "image" | "video";

export type GalleryCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  _count?: { items: number };
};

export type GalleryItem = {
  id: string;
  title: string;
  category: string;
  categoryId?: string | null;
  galleryCategory?: GalleryCategory | null;
  description: string;
  imageUrl: string;
  mediaType: GalleryMediaType;
  displayOrder: number;
  status: "active" | "draft";
  featured: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};
