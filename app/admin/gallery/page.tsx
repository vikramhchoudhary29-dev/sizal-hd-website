"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FolderPlus, Image as ImageIcon, Trash2, Video } from "lucide-react";
import { GalleryItem } from "@/types/gallery";
import { adminFetch } from "@/lib/api/adminToken";
import CloudinaryMultiUpload, { UploadedMedia } from "@/components/admin/CloudinaryMultiUpload";

type GalleryCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  _count?: { items: number };
};

export default function GalleryAdminPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("All");
  const [uploads, setUploads] = useState<UploadedMedia[]>([]);
  const [uploadResetKey, setUploadResetKey] = useState(0);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categorySaving, setCategorySaving] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const galleryFormRef = useRef<HTMLFormElement | null>(null);

  async function load() {
    setLoading(true);
    try {
      const [galleryResponse, categoryResponse] = await Promise.all([
        fetch("/api/content/gallery", { cache: "no-store" }),
        fetch("/api/gallery/categories", { cache: "no-store" }),
      ]);
      const galleryJson = await galleryResponse.json();
      const categoryJson = await categoryResponse.json();
      setItems(Array.isArray(galleryJson.data) ? galleryJson.data : []);
      const nextCategories = Array.isArray(categoryJson.data) ? categoryJson.data : [];
      setCategories(nextCategories);
      setSelectedCategoryId((current) => current || nextCategories[0]?.id || "");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function createCategory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!categoryName.trim()) return;
    setCategorySaving(true);
    try {
      const response = await adminFetch("/api/gallery/categories", {
        method: "POST",
        body: JSON.stringify({ name: categoryName, description: categoryDescription }),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Failed to create category");
      setCategoryName("");
      setCategoryDescription("");
      await load();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to create category");
    } finally {
      setCategorySaving(false);
    }
  }

  async function deleteCategory(category: GalleryCategory) {
    if (!confirm(`Delete gallery category "${category.name}"?`)) return;
    const response = await adminFetch(`/api/gallery/categories/${category.id}`, { method: "DELETE" });
    const json = await response.json();
    if (!response.ok) {
      alert(json.error || "Unable to delete category");
      return;
    }
    if (filter === category.name) setFilter("All");
    await load();
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!uploads.length) {
      alert("Please choose at least one image or video.");
      return;
    }

    const formElement = galleryFormRef.current;
    if (!formElement) {
      alert("Gallery form is not available. Please refresh the page and try again.");
      return;
    }

    const form = new FormData(formElement);
    const categoryId = selectedCategoryId || String(form.get("categoryId") || "");
    const category = categories.find((entry) => entry.id === categoryId);
    setSaving(true);

    try {
      for (let index = 0; index < uploads.length; index += 1) {
        const media = uploads[index];
        const titlePrefix = String(form.get("title") || "").trim();
        const title = titlePrefix || media.name.replace(/\.[^/.]+$/, "");
        const body = {
          title,
          categoryId,
          category: category?.name || "",
          description: String(form.get("description") || ""),
          imageUrl: media.url,
          mediaType: media.type,
          displayOrder: Number(form.get("displayOrder") || 0) + index,
          status: String(form.get("status") || "active"),
          featured: form.get("featured") === "on",
        };

        const response = await adminFetch("/api/content/gallery", {
          method: "POST",
          body: JSON.stringify(body),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.error || `Failed to save ${media.name}`);
      }

      // Reset through the stable ref instead of React event.currentTarget.
      // React event.currentTarget can become null after an awaited request.
      galleryFormRef.current?.reset();
      setUploads([]);
      setUploadResetKey((value) => value + 1);
      await load();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save gallery media");
    } finally {
      setSaving(false);
    }
  }

  async function del(id: string) {
    if (!confirm("Delete this gallery item?")) return;
    const response = await adminFetch(`/api/content/gallery/${id}`, { method: "DELETE" });
    if (!response.ok) {
      const json = await response.json();
      alert(json.error || "Delete failed");
      return;
    }
    await load();
  }

  const visibleItems = useMemo(() => {
    if (filter === "All") return items;
    return items.filter((item) => item.galleryCategory?.name === filter || (!item.galleryCategory && item.category === filter));
  }, [filter, items]);

  return (
    <div className="w-full min-w-0 max-w-full space-y-7 overflow-x-hidden">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.25em] text-[#9a5a41]">Media Center</p>
          <h1 className="mt-2 text-4xl font-black md:text-5xl">Gallery</h1>
          <p className="mt-2 max-w-2xl text-slate-500">Create albums, upload mixed image/video batches directly from your computer, and control what appears publicly.</p>
        </div>
        <a href="/gallery" target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">Open Public Gallery</a>
      </div>

      <section className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
        <form onSubmit={createCategory} className="min-w-0 max-w-full rounded-3xl border border-[#ddd2c5] bg-[#f7f1e9] p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2d2925] text-white"><FolderPlus size={20} /></div>
            <div><h2 className="text-xl font-black">Create Gallery Category</h2><p className="text-sm text-slate-500">Categories become public gallery albums.</p></div>
          </div>
          <div className="mt-5 grid gap-3">
            <input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="Category name e.g. Product Launch" className="min-h-12 rounded-xl border bg-white px-4" />
            <textarea value={categoryDescription} onChange={(e) => setCategoryDescription(e.target.value)} placeholder="Short description (optional)" rows={3} className="rounded-xl border bg-white p-4" />
            <button disabled={categorySaving} className="min-h-12 rounded-xl bg-blue-600 px-5 font-black text-white disabled:opacity-60">{categorySaving ? "Creating..." : "Create Category"}</button>
          </div>
        </form>

        <section className="min-w-0 max-w-full rounded-3xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div><h2 className="text-xl font-black">Gallery Albums</h2><p className="text-sm text-slate-500">{categories.length} categories</p></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.length === 0 ? <p className="text-sm text-slate-500">Create your first category.</p> : categories.map((category) => (
              <div key={category.id} className="rounded-2xl border bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div><p className="font-black">{category.name}</p><p className="mt-1 text-xs text-slate-500">{category._count?.items ?? 0} media</p></div>
                  <button type="button" onClick={() => deleteCategory(category)} className="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label={`Delete ${category.name}`}><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>

      <div className="grid w-full min-w-0 max-w-full gap-7 overflow-hidden xl:grid-cols-[minmax(0,430px)_minmax(0,1fr)]">
        <form ref={galleryFormRef} onSubmit={submit} className="w-full min-w-0 max-w-full overflow-hidden rounded-3xl border bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-2xl font-black">Bulk Upload</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">Choose any mix of images and videos. Each uploaded file becomes its own gallery item inside the selected album.</p>

          <div className="mt-5 grid gap-4">
            <input name="title" placeholder="Shared title (optional)" className="min-h-12 rounded-xl border px-4" />
            <select name="categoryId" value={selectedCategoryId} onChange={(event) => setSelectedCategoryId(event.target.value)} required={categories.length > 0} className="min-h-12 w-full min-w-0 max-w-full rounded-xl border px-4">
              <option value="">No album / legacy category</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
            <CloudinaryMultiUpload name="uploads" onChange={setUploads} resetKey={uploadResetKey} />
            <textarea name="description" placeholder="Description applied to all selected media (optional)" rows={4} className="rounded-xl border p-4" />
            <div className="grid gap-4 sm:grid-cols-2">
              <input name="displayOrder" type="number" defaultValue="0" className="min-h-12 rounded-xl border px-4" placeholder="Start order" />
              <select name="status" defaultValue="active" className="min-h-12 rounded-xl border px-4"><option value="active">Active</option><option value="draft">Draft</option></select>
            </div>
            <label className="flex min-h-11 items-center gap-3 font-bold"><input name="featured" type="checkbox" className="h-5 w-5" /> Feature these media items</label>
            <button disabled={saving || !uploads.length} className="min-h-12 rounded-xl bg-blue-600 px-6 font-black text-white disabled:opacity-60">{saving ? "Saving Media..." : `Save ${uploads.length || "Selected"} Media`}</button>
          </div>
        </form>

        <section className="w-full min-w-0 max-w-full overflow-hidden rounded-3xl border bg-white p-5 shadow-sm md:p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div><h2 className="text-2xl font-black">Media Library</h2><p className="text-sm text-slate-500">Filter the library by album.</p></div>
            <div className="flex min-w-0 max-w-full gap-2 overflow-x-auto pb-1">
              {["All", ...categories.map((category) => category.name), ...Array.from(new Set(items.filter((item) => !item.galleryCategory && item.category).map((item) => item.category)))].map((name) => (
                <button key={name} type="button" onClick={() => setFilter(name)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${filter === name ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700"}`}>{name}</button>
              ))}
            </div>
          </div>

          {loading ? <p className="py-16 text-center text-slate-500">Loading gallery...</p> : visibleItems.length === 0 ? <p className="py-16 text-center text-slate-500">No gallery media found.</p> : (
            <div className="grid w-full min-w-0 max-w-full gap-5 sm:grid-cols-2 2xl:grid-cols-3">
              {visibleItems.map((item) => (
                <article key={item.id} className="min-w-0 overflow-hidden rounded-2xl border bg-white">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                    {item.mediaType === "video" ? <><video src={item.imageUrl} controls playsInline className="h-full w-full object-contain" /><span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1.5 text-xs font-bold text-white"><Video size={12} /> Video</span></> : <><img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" /><span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1.5 text-xs font-bold text-white"><ImageIcon size={12} /> Image</span></>}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate text-xs font-black uppercase tracking-widest text-blue-600">{item.galleryCategory?.name || item.category || "Uncategorized"}</p><h3 className="mt-1 truncate text-lg font-black">{item.title}</h3></div><button onClick={() => del(item.id)} className="rounded-xl bg-red-50 p-2.5 text-red-600" aria-label="Delete gallery item"><Trash2 size={16} /></button></div>
                    {item.description && <p className="mt-2 line-clamp-2 text-sm text-slate-500">{item.description}</p>}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
