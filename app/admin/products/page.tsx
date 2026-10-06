"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import { adminFetch } from "@/lib/api/adminToken";
import ProductExcelImport from "@/components/admin/ProductExcelImport";

export default function ProductsAdminPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/content/products", { cache: "no-store" });
      const j = await r.json();
      setItems(j.data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  async function del(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const r = await adminFetch(`/api/content/products/${id}`, { method: "DELETE" });
    if (!r.ok) {
      const j = await r.json();
      alert(j.error || "Delete failed");
      return;
    }
    void load();
  }

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-black">Products</h1>
          <p className="mt-2 text-slate-500">Manage Sizal HD lens products and their product information tables.</p>
        </div>
        <Link href="/admin/products/new" className="rounded-xl bg-blue-600 px-6 py-4 text-center font-bold text-white">Add Product</Link>
      </div>

      <ProductExcelImport onImported={() => void load()} />

      <div className="rounded-3xl border bg-white p-8 shadow-sm">
        {loading ? <p className="text-slate-500">Loading products...</p> : items.length === 0 ? <p className="text-slate-500">No products added yet.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-sm text-slate-500">
                  <th className="py-4">Product</th>
                  <th>Code</th>
                  <th>Category</th>
                  <th>Table Rows</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id} className="border-b">
                    <td className="py-5 font-bold">{p.name}</td>
                    <td>{p.code}</td>
                    <td>{p.category}</td>
                    <td>{p.tableRows?.length || 0}</td>
                    <td className="capitalize">{p.status}</td>
                    <td>{p.featured ? "Yes" : "No"}</td>
                    <td className="text-right">
                      <Link href={`/admin/products/${p.id}/edit`} className="mr-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-bold">Edit</Link>
                      <button onClick={() => void del(p.id)} className="rounded-lg bg-red-50 px-4 py-2 text-sm font-bold text-red-600">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
