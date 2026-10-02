"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { GalleryItem } from "@/types/gallery";

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content/gallery?active=true", { cache: "no-store" })
      .then((response) => response.json())
      .then((json) => setItems(Array.isArray(json.data) ? json.data.slice(0, 6) : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="gallery" className="px-6 py-24 md:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black tracking-[0.3em] text-blue-600">SIZAL HD GALLERY</p>
            <h2 className="mt-3 max-w-3xl text-4xl font-black tracking-tight md:text-6xl">A closer look at the Sizal HD world.</h2>
          </div>
          <Link href="/gallery" className="inline-flex items-center gap-2 font-bold text-blue-600">View Full Gallery <ArrowRight size={18} /></Link>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((item) => <div key={item} className="aspect-[4/3] animate-pulse rounded-[2rem] bg-slate-100" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-[2rem] border bg-white p-10 text-center text-slate-500">Gallery highlights will appear here soon.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {items.map((item) => (
              <Link href="/gallery" key={item.id} className="group overflow-hidden rounded-[2rem] border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                  {item.mediaType === "video" ? (
                    <>
                      <video src={item.imageUrl} muted playsInline preload="metadata" className="h-full w-full object-cover" />
                      <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-2 text-xs font-bold text-white backdrop-blur"><Play size={12} fill="currentColor" /> Video</span>
                    </>
                  ) : (
                    <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xs font-black uppercase tracking-widest text-blue-600">{item.category || "Gallery"}</p>
                  <h3 className="mt-2 text-xl font-black">{item.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
