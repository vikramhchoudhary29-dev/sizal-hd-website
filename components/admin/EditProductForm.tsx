"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { defaultCategories } from "@/lib/constants/categories";
import { Product } from "@/types/product";
import { adminFetch } from "@/lib/api/adminToken";
import CloudinaryUpload from "@/components/admin/CloudinaryUpload";
import ProductTableEditor from "@/components/admin/ProductTableEditor";

export default function EditProductForm({ id }: { id: string }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/content/products/${id}`, { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((json) => setProduct(json.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      const form = new FormData(e.currentTarget);
      const body = Object.fromEntries(form.entries());
      body.featured = form.get("featured") === "on" ? "true" : "false";

      if (!body.imageUrl) throw new Error("Please upload the product image.");

      const response = await adminFetch(`/api/content/products/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Failed to update product");

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update product");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-slate-500">Loading product...</p>;
  if (!product) return <p className="text-red-600">Product not found.</p>;

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <input name="name" required defaultValue={product.name} className="rounded-xl border p-4" />
        <input name="code" required defaultValue={product.code} className="rounded-xl border p-4" />
        <select name="category" required defaultValue={product.category} className="rounded-xl border p-4">
          <option value="">Select Category</option>
          {defaultCategories.map((cat) => <option key={cat}>{cat}</option>)}
        </select>
        <select name="status" defaultValue={product.status} className="rounded-xl border p-4">
          <option value="active">Active</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <textarea name="shortDescription" defaultValue={product.shortDescription} placeholder="Short Description" className="rounded-xl border p-4" />
      <textarea name="fullDescription" defaultValue={product.fullDescription} placeholder="Full Description" className="min-h-32 rounded-xl border p-4" />

      <div className="grid gap-6 md:grid-cols-2">
        <input name="lensIndex" defaultValue={product.lensIndex} placeholder="Lens Index" className="rounded-xl border p-4" />
        <input name="coating" defaultValue={product.coating} placeholder="Coating" className="rounded-xl border p-4" />
      </div>

      <ProductTableEditor initialRows={product.tableRows || []} />

      <div className="grid gap-6 md:grid-cols-2">
        <CloudinaryUpload label="Product Image" name="imageUrl" value={product.imageUrl} resourceType="image" />
        <CloudinaryUpload label="Cover Image" name="coverImageUrl" value={product.coverImageUrl} resourceType="image" />
        <CloudinaryUpload label="Product Video" name="videoUrl" value={product.videoUrl} resourceType="video" />
        <CloudinaryUpload label="Product PDF" name="pdfUrl" value={product.pdfUrl} resourceType="raw" />
      </div>

      <label className="flex items-center gap-3 font-bold">
        <input name="featured" type="checkbox" defaultChecked={product.featured} /> Featured Product
      </label>

      <input name="seoTitle" defaultValue={product.seoTitle} placeholder="SEO Title" className="rounded-xl border p-4" />
      <textarea name="seoDescription" defaultValue={product.seoDescription} placeholder="SEO Description" className="rounded-xl border p-4" />

      <button disabled={saving} className="rounded-xl bg-blue-600 px-6 py-4 font-bold text-white disabled:opacity-60">
        {saving ? "Updating..." : "Update Product"}
      </button>
    </form>
  );
}
