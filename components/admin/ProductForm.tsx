"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { defaultCategories } from "@/lib/constants/categories";
import { adminFetch } from "@/lib/api/adminToken";
import CloudinaryUpload from "@/components/admin/CloudinaryUpload";
import ProductTableEditor from "@/components/admin/ProductTableEditor";

export default function ProductForm() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      const form = new FormData(e.currentTarget);
      const body = Object.fromEntries(form.entries());
      body.featured = form.get("featured") === "on" ? "true" : "false";

      if (!body.imageUrl) {
        throw new Error("Please upload the product image.");
      }

      const response = await adminFetch("/api/content/products", {
        method: "POST",
        body: JSON.stringify(body),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Failed to save product");

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <input name="name" required placeholder="Product Name" className="rounded-xl border p-4" />
        <input name="code" required placeholder="Product Code" className="rounded-xl border p-4" />
        <select name="category" required className="rounded-xl border p-4">
          <option value="">Select Category</option>
          {defaultCategories.map((cat) => <option key={cat}>{cat}</option>)}
        </select>
        <select name="status" defaultValue="active" className="rounded-xl border p-4">
          <option value="active">Active</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <textarea name="shortDescription" placeholder="Short Description" className="rounded-xl border p-4" />
      <textarea name="fullDescription" placeholder="Full Description" className="min-h-32 rounded-xl border p-4" />

      <div className="grid gap-6 md:grid-cols-2">
        <input name="lensIndex" placeholder="Lens Index" className="rounded-xl border p-4" />
        <input name="coating" placeholder="Coating" className="rounded-xl border p-4" />
      </div>

      <ProductTableEditor />

      <div className="grid gap-6 md:grid-cols-2">
        <CloudinaryUpload label="Product Image" name="imageUrl" resourceType="image" />
        <CloudinaryUpload label="Cover Image" name="coverImageUrl" resourceType="image" />
        <CloudinaryUpload label="Product Video" name="videoUrl" resourceType="video" />
        <CloudinaryUpload label="Product PDF" name="pdfUrl" resourceType="raw" />
      </div>

      <label className="flex items-center gap-3 font-bold">
        <input name="featured" type="checkbox" /> Featured Product
      </label>

      <input name="seoTitle" placeholder="SEO Title" className="rounded-xl border p-4" />
      <textarea name="seoDescription" placeholder="SEO Description" className="rounded-xl border p-4" />

      <button disabled={saving} className="rounded-xl bg-blue-600 px-6 py-4 font-bold text-white disabled:opacity-60">
        {saving ? "Saving..." : "Save Product"}
      </button>
    </form>
  );
}
