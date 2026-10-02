"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@/types/product";

const REQUEST_TIMEOUT_MS = 10000;

export default function Products() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/content/products?active=true", {
          cache: "no-store",
          signal: controller.signal,
        });

        const json = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(json.error || "Failed to load products");
        }

        setItems(Array.isArray(json.data) ? json.data.slice(0, 6) : []);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          setError("Products are taking too long to load.");
        } else {
          console.error("Homepage products error:", error);
          setError(error instanceof Error ? error.message : "Products are temporarily unavailable.");
        }
      } finally {
        window.clearTimeout(timeout);
        setLoading(false);
      }
    }

    loadProducts();

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  return (
    <section id="products" className="px-6 py-24 md:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex items-end justify-between gap-5">
          <div>
            <p className="text-xs font-black tracking-[0.3em] text-blue-600">
              PRODUCT RANGE
            </p>
            <h2 className="mt-3 text-4xl font-black md:text-6xl">
              Precision lenses for every need.
            </h2>
          </div>

          <Link href="/products" className="font-bold text-blue-600">
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[390px] animate-pulse rounded-[2rem] border bg-white p-5 shadow-sm"
              >
                <div className="h-64 rounded-2xl bg-slate-100" />
                <div className="mt-5 h-3 w-24 rounded bg-slate-100" />
                <div className="mt-3 h-7 w-3/4 rounded bg-slate-100" />
                <div className="mt-3 h-4 w-full rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-8 text-center">
            <p className="font-bold text-amber-800">{error}</p>
          </div>
        ) : items.length === 0 ? (
          <p className="text-slate-500">Products will appear here soon.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {items.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="overflow-hidden rounded-[2rem] border bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                {product.coverImageUrl || product.imageUrl ? (
                  <img
                    src={product.coverImageUrl || product.imageUrl}
                    alt={product.name}
                    className="h-64 w-full object-contain"
                  />
                ) : (
                  <div className="flex h-64 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                    No Image
                  </div>
                )}

                <div className="p-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                    {product.category}
                  </p>
                  <h3 className="mt-2 text-2xl font-black">{product.name}</h3>
                  <p className="mt-2 text-slate-600">
                    {product.shortDescription}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
