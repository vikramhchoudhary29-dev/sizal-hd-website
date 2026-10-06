"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import WebsiteNavbar from "@/components/website/WebsiteNavbar";
import Footer from "@/components/layout/Footer";
import { Product } from "@/types/product";

const REQUEST_TIMEOUT_MS = 10000;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
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

        setProducts(Array.isArray(json.data) ? json.data : []);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          setError("Products are taking too long to load.");
        } else {
          console.error("Products page error:", error);
          setError(error instanceof Error ? error.message : "Unable to load products right now.");
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

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(products.map((product) => product.category).filter(Boolean))
      ),
    ],
    [products]
  );

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === "All" || product.category === category)
  );

  return (
    <main className="min-h-screen bg-[#F8FBFF]">
      <WebsiteNavbar />

      <section className="px-6 pb-20 pt-40 md:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-4 text-xs font-black tracking-[0.3em] text-blue-600">
              SIZAL HD PRODUCTS
            </p>
            <h1 className="text-5xl font-black tracking-tight md:text-7xl">
              Premium Lens Range
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Explore Sizal HD lenses with advanced clarity, protection and
              comfort.
            </p>
          </div>

          <div className="mb-10 grid gap-4 md:grid-cols-[1fr_260px]">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
              className="rounded-2xl border bg-white p-4 outline-none focus:border-blue-600"
            />
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="rounded-2xl border bg-white p-4 outline-none focus:border-blue-600"
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="grid gap-7 md:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-[460px] animate-pulse rounded-[2rem] border bg-white p-4"
                >
                  <div className="h-64 rounded-2xl bg-slate-100" />
                  <div className="mt-6 h-6 w-24 rounded bg-slate-100" />
                  <div className="mt-4 h-8 w-3/4 rounded bg-slate-100" />
                  <div className="mt-4 h-4 w-full rounded bg-slate-100" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-10 text-center">
              <h2 className="text-2xl font-black text-amber-900">
                Products are temporarily unavailable
              </h2>
              <p className="mt-3 text-amber-800">{error}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <p className="text-center text-slate-500">No products found.</p>
          ) : (
            <div className="grid gap-7 md:grid-cols-3">
              {filteredProducts.map((product) => (
                <Link
                  href={`/products/${product.id}`}
                  key={product.id}
                  className="group overflow-hidden rounded-[2rem] border bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                >
                  {product.coverImageUrl || product.imageUrl ? (
                    <img
                      src={product.coverImageUrl || product.imageUrl}
                      alt={product.name}
                      className="h-64 w-full object-contain p-4"
                    />
                  ) : (
                    <div className="flex h-64 items-center justify-center bg-slate-100 text-slate-400">
                      No Image
                    </div>
                  )}

                  <div className="p-7">
                    <span className="mb-4 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                      {product.category}
                    </span>
                    <h2 className="text-2xl font-black">{product.name}</h2>
                    <p className="mt-3 line-clamp-2 text-slate-600">
                      {product.shortDescription}
                    </p>
                    <p className="mt-6 font-bold text-blue-600">
                      View Details →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
