"use client";
import ProductLayerExplorer from "@/components/sections/ProductLayerExplorer";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Download,
  FileText,
  ShieldCheck,
  Sparkles,
  Image as ImageIcon,
  X,
  Zap,
} from "lucide-react";
import WebsiteNavbar from "@/components/website/WebsiteNavbar";
import Footer from "@/components/layout/Footer";
import { Product } from "@/types/product";

const performance = [
  { label: "HD Clarity", value: "96%" },
  { label: "Visual Comfort", value: "92%" },
  { label: "Coating Strength", value: "90%" },
  { label: "Daily Protection", value: "95%" },
];

const experiencePoints = [
  "Premium optical clarity",
  "Comfortable everyday vision",
  "Advanced lens coating",
  "Designed for modern lifestyle",
];




export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [previewRow, setPreviewRow] = useState<NonNullable<Product["tableRows"]>[number] | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);

    async function fetchProduct() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/content/products/${id}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        const json = await response.json().catch(() => ({}));

        if (!response.ok || !json.data) {
          throw new Error(json.error || "Product could not be loaded");
        }

        const productData = json.data as Product;
        setProduct(productData);

        const relatedResponse = await fetch(`/api/content/products?active=true`, {
          cache: "no-store",
          signal: controller.signal,
        });

        if (relatedResponse.ok) {
          const relatedJson = await relatedResponse.json();
          setRelatedProducts(
            (Array.isArray(relatedJson.data) ? relatedJson.data : [])
              .filter(
                (item: Product) =>
                  item.id !== productData.id &&
                  item.category === productData.category
              )
              .slice(0, 3)
          );
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          setError("This product is taking too long to load.");
        } else {
          console.error("Product details error:", err);
          setError("Unable to load this product right now.");
        }
      } finally {
        window.clearTimeout(timeout);
        setLoading(false);
      }
    }

    fetchProduct();

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#061019] text-white">
        <div className="text-center">
          <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-cyan-300" />
          <p className="font-bold tracking-wide text-slate-300">
            Loading product experience...
          </p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#f7fbff] px-6 text-center">
        <h1 className="text-4xl font-black">{error ? "Unable to Load Product" : "Product Not Found"}</h1>
        {error && <p className="max-w-xl text-slate-600">{error}</p>}

        <Link
          href="/products"
          className="rounded-full bg-blue-600 px-7 py-4 font-bold text-white"
        >
          Back to Products
        </Link>
      </main>
    );
  }

  return (
    <>
      <WebsiteNavbar />

      <main className="overflow-hidden bg-[#f7fbff] text-slate-950">
        <section className="relative min-h-screen overflow-hidden bg-[#061019] px-5 pb-24 pt-20 text-white md:px-12 lg:px-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(0,198,255,0.18),transparent_35%),radial-gradient(circle_at_75%_70%,rgba(227,30,36,0.12),transparent_30%)]" />

          <div className="relative z-10 mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="mb-7 text-sm text-slate-400">
                <Link href="/" className="hover:text-white">
                  Home
                </Link>{" "}
                /{" "}
                <Link href="/products" className="hover:text-white">
                  Products
                </Link>{" "}
                / <span className="text-white">{product.name}</span>
              </div>

              <p className="mb-5 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-cyan-300">
                {product.category || "Sizal HD Lens"}
              </p>

              <h1 className="max-w-3xl text-4xl font-black leading-[0.95] tracking-[-0.05em] md:text-6xl">
                {product.name}
              </h1>

              <p className="mt-5 text-sm font-bold uppercase tracking-[0.22em] text-slate-400">
                Product Code : {product.code || "SIZAL-HD"}
              </p>

              <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-300">
                {product.shortDescription ||
                  "Premium spectacle lens engineered for crystal-clear vision, advanced protection and all-day comfort."}
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                {product.pdfUrl && (
                  <a
                    href={product.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 font-black text-slate-950 transition hover:-translate-y-1 hover:bg-cyan-300"
                  >
                    <Download size={18} />
                    Download PDF
                  </a>
                )}

                <Link
                  href="/dealer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-4 font-black text-white transition hover:-translate-y-1 hover:border-cyan-300 hover:text-cyan-300"
                >
                  Become Dealer
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-3xl" />

              <div className="relative mx-auto flex h-[460px] max-w-[620px] items-center justify-center rounded-[3rem] border border-white/10 bg-white/[0.055] shadow-[0_40px_120px_rgba(0,0,0,0.35)] backdrop-blur-xl md:h-[560px]">
{product.videoUrl ? (
  <video
    key={product.videoUrl}
    autoPlay
    muted
    loop
    playsInline
    preload="auto"
    className="absolute inset-0 h-full w-full rounded-[3rem] object-contain p-4"
  >
    <source src={product.videoUrl} type="video/mp4" />
  </video>
) : product.coverImageUrl ? (
  <img
    src={product.coverImageUrl}
    alt={product.name}
    className="absolute inset-0 h-full w-full rounded-[3rem] object-contain p-4"
  />
) : product.imageUrl ? (
  <img
    src={product.imageUrl}
    alt={product.name}
    className="absolute inset-0 h-full w-full rounded-[3rem] object-contain p-4"
  />
) : (
  <div className="absolute inset-0 flex items-center justify-center rounded-[3rem] bg-slate-900 text-slate-400">
    No Preview Available
  </div>
)}
              </div>
            </div>
          </div>
        </section>

        {product.tableRows && product.tableRows.length > 0 && (
          <section className="bg-white px-5 py-14 md:px-12 md:py-20 lg:px-16">
            <div className="mx-auto max-w-7xl">
              <div className="mb-8">
                <p className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-[#E31E24]">
                  Product Range
                </p>
                <h2 className="text-3xl font-black tracking-[-0.04em] md:text-5xl">
                  Product Information
                </h2>
              </div>

              <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
                <div className="overflow-x-auto">
                  <table className="min-w-[920px] w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-[#f4d65e] text-slate-950">
                        <th className="w-24 px-5 py-4 text-sm font-black">Index</th>
                        <th className="w-16 px-3 py-4 text-center text-sm font-black" aria-label="Product image" />
                        <th className="px-5 py-4 text-sm font-black">Product Name</th>
                        <th className="px-5 py-4 text-sm font-black">Dia (mm)</th>
                        <th className="px-5 py-4 text-sm font-black">Coating Colour</th>
                        <th className="px-5 py-4 text-sm font-black">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.tableRows.map((row, index) => {
                        const ranges = (row.description || "")
                          .split(/[\s,;|]+/)
                          .map((value) => value.trim())
                          .filter(Boolean);

                        const previewImage = product.coverImageUrl || product.imageUrl;

                        return (
                          <tr
                            key={row.id || index}
                            className="border-t border-slate-200 align-top even:bg-slate-50"
                          >
                            <td className="px-5 py-4 font-bold text-slate-800">
                              {row.indexValue || "—"}
                            </td>

                            <td className="px-3 py-4 text-center">
                              {previewImage ? (
                                <button
                                  type="button"
                                  onClick={() => setPreviewRow(row)}
                                  aria-label={`View image for ${row.productName || product.name}`}
                                  title="View product image"
                                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-400 hover:text-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/15"
                                >
                                  <ImageIcon size={17} strokeWidth={2.2} />
                                </button>
                              ) : (
                                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-300">
                                  <ImageIcon size={17} />
                                </span>
                              )}
                            </td>

                            <td className="px-5 py-4 font-bold text-slate-800">
                              {row.productName || product.name || "—"}
                            </td>
                            <td className="px-5 py-4 text-slate-700">
                              {row.dia || "—"}
                            </td>
                            <td className="px-5 py-4 text-slate-700">
                              {row.coatingColour || "—"}
                            </td>
                            <td className="px-5 py-4 text-slate-700">
                              {ranges.length > 0 ? (
                                <div className="space-y-1.5 leading-6">
                                  {ranges.map((range, rangeIndex) => (
                                    <div key={`${range}-${rangeIndex}`} className="whitespace-nowrap">
                                      {range}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                "—"
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}

        {previewRow && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-5 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label="Product image preview"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setPreviewRow(null);
              }
            }}
          >
            <div className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-[1.5rem] border border-white/15 bg-white p-3 shadow-2xl">
              <button
                type="button"
                onClick={() => setPreviewRow(null)}
                aria-label="Close image preview"
                className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/80 text-white shadow-lg transition hover:bg-slate-950 focus:outline-none focus:ring-4 focus:ring-white/30"
              >
                <X size={20} />
              </button>

              <div className="flex max-h-[84vh] items-center justify-center rounded-[1.1rem] bg-slate-100 p-4">
                <img
                  src={product.coverImageUrl || product.imageUrl || ""}
                  alt={previewRow.productName || product.name || "Product image"}
                  className="max-h-[80vh] max-w-full object-contain"
                />
              </div>

              <p className="px-3 pb-2 pt-4 text-center text-sm font-bold text-slate-700">
                {previewRow.productName || product.name}
              </p>
            </div>
          </div>
        )}

        <section className="px-5 py-24 md:px-12 md:py-28 lg:px-16">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-[2rem] border border-white bg-white p-8 shadow-[0_30px_90px_rgba(15,23,42,0.08)] md:p-10">
              <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-[#E31E24]">
                Product Story
              </p>

              <h2 className="text-4xl font-black tracking-[-0.05em] md:text-5xl">
                Designed To Make Vision Feel Effortless.
              </h2>

              <p className="mt-6 leading-8 text-slate-600">
                {product.fullDescription ||
                  product.shortDescription ||
                  "This lens is created for users who demand clarity, comfort and performance in daily life. Its advanced coating and optical design help improve visual confidence across modern environments."}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {experiencePoints.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2
                      size={20}
                      className="mt-1 shrink-0 text-teal-600"
                    />
                    <span className="font-semibold leading-7 text-slate-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_30px_90px_rgba(15,23,42,0.08)] md:p-10">
              <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-blue-600">
                Performance
              </p>

              <h2 className="text-4xl font-black tracking-[-0.05em]">
                Lens Performance Dashboard
              </h2>

              <div className="mt-8 space-y-6">
                {performance.map((item) => (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-bold text-slate-700">
                        {item.label}
                      </span>
                      <span className="font-black text-teal-600">
                        {item.value}
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-teal-400"
                        style={{ width: item.value }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
{product.videoUrl && (
  <section className="bg-[#f7fbff] px-5 pb-10 md:px-12 lg:px-16">
    <div className="mx-auto max-w-7xl">
      <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-3 shadow-[0_35px_100px_rgba(15,23,42,0.12)]">
        <video
          autoPlay
          muted
          loop
          playsInline
          controls
          preload="auto"
          className="aspect-video w-full rounded-[2rem] object-cover"
        >
          <source src={product.videoUrl} type="video/mp4" />
        </video>
      </div>
    </div>
  </section>
)}


        <section className="bg-[#061019] px-5 py-24 text-white md:px-12 md:py-28 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
                  Documents
                </p>

                <h2 className="text-4xl font-black tracking-[-0.05em] md:text-6xl">
                  Product Resources
                </h2>

                <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                  Access product information, technical specifications and
                  downloadable resources for dealer reference.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {product.pdfUrl ? (
                  <a
                    href={product.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-[2rem] border border-white/10 bg-white/[0.055] p-7 transition hover:-translate-y-2 hover:border-cyan-300/30 hover:bg-white/[0.08]"
                  >
                    <FileText className="mb-8 text-cyan-300" size={36} />
                    <h3 className="text-2xl font-black">Product PDF</h3>
                    <p className="mt-3 leading-7 text-slate-300">
                      Download detailed product information.
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 font-black text-cyan-300">
                      Download <ArrowRight size={16} />
                    </span>
                  </a>
                ) : (
                  <div className="rounded-[2rem] border border-white/10 bg-white/[0.055] p-7">
                    <FileText className="mb-8 text-slate-500" size={36} />
                    <h3 className="text-2xl font-black">PDF Coming Soon</h3>
                    <p className="mt-3 leading-7 text-slate-300">
                      Product documents will be available soon.
                    </p>
                  </div>
                )}

                <Link
                  href="/dealer"
                  className="group rounded-[2rem] border border-white/10 bg-white/[0.055] p-7 transition hover:-translate-y-2 hover:border-cyan-300/30 hover:bg-white/[0.08]"
                >
                  <ShieldCheck className="mb-8 text-[#E31E24]" size={36} />
                  <h3 className="text-2xl font-black">Dealer Access</h3>
                  <p className="mt-3 leading-7 text-slate-300">
                    Register as a dealer to access complete product support.
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 font-black text-cyan-300">
                    Become Dealer <ArrowRight size={16} />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="px-5 py-24 md:px-12 md:py-28 lg:px-16">
            <div className="mx-auto max-w-7xl">
              <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                <div>
                  <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-[#E31E24]">
                    Related Products
                  </p>
                  <h2 className="text-4xl font-black tracking-[-0.05em] md:text-6xl">
                    Explore Similar Lenses
                  </h2>
                </div>

                <Link
                  href="/products"
                  className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-950 px-6 py-3 font-black text-white"
                >
                  View All Products
                  <ArrowRight size={17} />
                </Link>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {relatedProducts.map((item) => (
                  <Link
                    key={item.id}
                    href={`/products/${item.id}`}
                    className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.08)] transition hover:-translate-y-2"
                  >
           {item.coverImageUrl || item.imageUrl ? (
                      <img
                        src={item.coverImageUrl || item.imageUrl}
                        alt={item.name}
                        className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-72 items-center justify-center bg-slate-100">
                        No Image
                      </div>
                    )}

                    <div className="p-7">
                      <span className="text-sm font-black uppercase tracking-[0.2em] text-blue-600">
                        {item.category}
                      </span>

                      <h3 className="mt-3 text-2xl font-black tracking-[-0.04em]">
                        {item.name}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}

