"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Images, Play, X } from "lucide-react";
import WebsiteNavbar from "@/components/website/WebsiteNavbar";
import Footer from "@/components/layout/Footer";
import { GalleryCategory, GalleryItem } from "@/types/gallery";

type Settings = {
  galleryHeroTitle?: string;
  galleryHeroHighlight?: string;
  galleryHeroSubtitle?: string;
};

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [category, setCategory] = useState("All");
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const [galleryResponse, categoryResponse, settingsResponse] = await Promise.all([
          fetch("/api/content/gallery?active=true", { cache: "no-store", signal: controller.signal }),
          fetch("/api/gallery/categories", { cache: "no-store", signal: controller.signal }),
          fetch("/api/content/settings", { cache: "no-store", signal: controller.signal }),
        ]);
        const galleryJson = await galleryResponse.json();
        const categoryJson = await categoryResponse.json();
        const settingsJson = await settingsResponse.json();
        if (!galleryResponse.ok) throw new Error(galleryJson.error || "Failed to load gallery");
        setItems(Array.isArray(galleryJson.data) ? galleryJson.data : []);
        setCategories(Array.isArray(categoryJson.data) ? categoryJson.data : []);
        if (settingsJson.data?.[0]) setSettings(settingsJson.data[0]);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Unable to load gallery right now.");
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, []);

  const legacyCategories = useMemo(() => Array.from(new Set(items.filter((item) => !item.galleryCategory && item.category).map((item) => item.category))), [items]);
  const albumNames = useMemo(() => ["All", ...categories.map((item) => item.name), ...legacyCategories], [categories, legacyCategories]);
  const filteredItems = useMemo(() => category === "All" ? items : items.filter((item) => item.galleryCategory?.name === category || (!item.galleryCategory && item.category === category)), [items, category]);

  const albums = useMemo(() => {
    const map = new Map<string, { name: string; count: number; cover?: GalleryItem }>();
    for (const item of items) {
      const name = item.galleryCategory?.name || item.category || "Uncategorized";
      const current = map.get(name) || { name, count: 0, cover: undefined };
      current.count += 1;
      if (!current.cover || item.featured) current.cover = item;
      map.set(name, current);
    }
    return Array.from(map.values());
  }, [items]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#F8FBFF] text-slate-950">
      <WebsiteNavbar />

      <section className="relative px-5 pb-16 pt-32 sm:px-6 sm:pt-36 md:px-10 md:pb-24 md:pt-44 lg:px-20">
        <div className="absolute inset-x-0 top-0 -z-0 h-[560px] bg-[radial-gradient(circle_at_50%_15%,rgba(37,99,235,0.20),transparent_40%),radial-gradient(circle_at_15%_40%,rgba(14,165,233,0.12),transparent_28%),radial-gradient(circle_at_85%_45%,rgba(227,30,36,0.08),transparent_25%)]" />
        <div className="relative z-10 mx-auto max-w-6xl text-center">
          <p className="mb-5 text-[11px] font-black tracking-[0.3em] text-blue-600 sm:text-xs">SIZAL HD MEDIA GALLERY</p>
          <h1 className="mx-auto max-w-5xl text-4xl font-black leading-[0.95] tracking-[-0.06em] sm:text-5xl md:text-7xl lg:text-8xl">
            {settings.galleryHeroTitle || "Sizal HD Gallery"}
            <br />
            <span className="bg-gradient-to-r from-slate-950 via-blue-600 to-red-500 bg-clip-text text-transparent">{settings.galleryHeroHighlight || "Precision in every frame."}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">{settings.galleryHeroSubtitle || "Explore product visuals, lens technology, events, people and the Sizal HD brand story."}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/products" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-slate-950 px-7 py-3.5 font-black text-white shadow-xl">Explore Products <ArrowRight size={18} /></Link>
            <a href="#albums" className="inline-flex min-h-12 items-center justify-center rounded-full border bg-white px-7 py-3.5 font-black shadow-sm">Browse Albums</a>
          </div>
        </div>
      </section>

      <section id="albums" className="px-5 pb-14 sm:px-6 md:px-10 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-7 flex items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.3em] text-blue-600">Albums</p><h2 className="mt-2 text-3xl font-black sm:text-4xl md:text-5xl">Explore by category</h2></div></div>
          {loading ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{[1,2,3,4].map((item) => <div key={item} className="aspect-[4/3] animate-pulse rounded-[2rem] bg-slate-100" />)}</div> : albums.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {albums.map((album) => <button key={album.name} onClick={() => { setCategory(album.name); document.getElementById("media")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className="group overflow-hidden rounded-[2rem] border border-white bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">{album.cover?.mediaType === "video" ? <video src={album.cover.imageUrl} muted playsInline preload="metadata" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : album.cover ? <img src={album.cover.imageUrl} alt={album.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : null}<div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" /><div className="absolute bottom-4 left-4 right-4 text-white"><p className="text-xs font-black uppercase tracking-widest opacity-80">Album</p><h3 className="mt-1 text-xl font-black">{album.name}</h3><p className="mt-1 text-sm font-semibold opacity-80">{album.count} media</p></div></div>
              </button>)}
            </div>
          ) : <div className="rounded-[2rem] border bg-white p-10 text-center text-slate-500">Gallery albums will appear here once media is uploaded.</div>}
        </div>
      </section>

      <section id="media" className="scroll-mt-28 px-5 pb-28 pt-4 sm:px-6 md:px-10 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-xs font-black uppercase tracking-[0.3em] text-blue-600">Media Library</p><h2 className="mt-2 text-3xl font-black sm:text-4xl md:text-5xl">{category === "All" ? "All media" : category}</h2></div><div className="flex gap-2 overflow-x-auto pb-1">{albumNames.map((name) => <button key={name} onClick={() => setCategory(name)} className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-bold ${category === name ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-white text-slate-700 shadow-sm"}`}>{name}</button>)}</div></div>
          {error ? <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-10 text-center text-amber-800">{error}</div> : loading ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[1,2,3,4,5,6].map((item) => <div key={item} className="aspect-[4/3] animate-pulse rounded-[2rem] bg-slate-100" />)}</div> : filteredItems.length === 0 ? <div className="rounded-[2rem] border bg-white p-12 text-center text-slate-500">No gallery media found in this album.</div> : <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">{filteredItems.map((item) => <MediaCard key={item.id} item={item} onOpen={() => setSelected(item)} />)}</div>}
        </div>
      </section>

      {selected && <MediaModal item={selected} onClose={() => setSelected(null)} />}
      <Footer />
    </main>
  );
}

function MediaCard({ item, onOpen }: { item: GalleryItem; onOpen: () => void }) {
  return <article className="mb-5 break-inside-avoid overflow-hidden rounded-[1.7rem] border border-white bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
    <button type="button" onClick={onOpen} className="block w-full text-left">
      <div className="relative overflow-hidden bg-slate-950">
        {item.mediaType === "video" ? <video src={item.imageUrl} muted playsInline preload="metadata" className="block h-auto max-h-[620px] w-full object-contain" /> : <img src={item.imageUrl} alt={item.title} className="block h-auto max-h-[620px] w-full object-contain transition duration-500 hover:scale-[1.02]" />}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-2 text-xs font-bold text-white backdrop-blur">{item.mediaType === "video" ? <Play size={12} fill="currentColor" /> : <Images size={12} />} {item.mediaType === "video" ? "Video" : "Image"}</span>
      </div>
    </button>
    <div className="p-5"><p className="text-xs font-black uppercase tracking-widest text-blue-600">{item.galleryCategory?.name || item.category || "Gallery"}</p><h3 className="mt-1 text-xl font-black">{item.title}</h3>{item.description && <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>}</div>
  </article>;
}

function MediaModal({ item, onClose }: { item: GalleryItem; onClose: () => void }) {
  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm" onClick={onClose}><div className="relative max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-black" onClick={(event) => event.stopPropagation()}><button type="button" onClick={onClose} className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20" aria-label="Close media"><X size={22} /></button>{item.mediaType === "video" ? <video src={item.imageUrl} controls autoPlay playsInline className="max-h-[82vh] w-full object-contain" /> : <img src={item.imageUrl} alt={item.title} className="max-h-[82vh] w-full object-contain" />}<div className="border-t border-white/10 bg-slate-950 p-4 text-white"><p className="font-black">{item.title}</p><p className="mt-1 text-sm text-slate-400">{item.galleryCategory?.name || item.category || "Gallery"}</p></div></div></div>;
}
