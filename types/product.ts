export type ProductStatus = "active" | "draft";

export type ProductTableRow = {
  id?: string;
  indexValue: string;
  productName: string;
  dia: string;
  coatingColour: string;
  description: string;
  displayOrder?: number;
};

export type Product = {
  id: string;
  name: string;
  code: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  lensIndex: string;
  coating: string;
  imageUrl: string;
  coverImageUrl: string;
  videoUrl: string;
  pdfUrl: string;
  status: ProductStatus;
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  tableRows?: ProductTableRow[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
};
