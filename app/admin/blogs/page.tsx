"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Copy, Edit3, Eye, FileText, Plus, Search, Share2, Star, Trash2, X } from "lucide-react";
import BlogEditor from "@/components/admin/BlogEditor";
import CloudinaryDropzone from "@/components/admin/CloudinaryDropzone";
import { BlogPost } from "@/types/blog";
import { adminFetch } from "@/lib/api/adminToken";

const emptyForm = {
  title: "",
  shortDescription: "",
  content: "",
  imageUrl: "",
  author: "",
  category: "",
  status: "active",
  featured: false,
  seoTitle: "",
  seoDescription: "",
};

type BlogForm = typeof emptyForm;

export default function BlogsPage() {
  const [items, setItems] = useState<BlogPost[]>([]);
  const [form, setForm] = useState<BlogForm>(emptyForm);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showEditor, setShowEditor] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const response = await fetch("/api/content/blogs", { cache: "no-store" });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Failed to load blogs");
      setItems(Array.isArray(json.data) ? json.data : []);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const matchesQuery = !q || [item.title, item.category, item.author, item.shortDescription].some((value) => value.toLowerCase().includes(q));
      return matchesStatus && matchesQuery;
    });
  }, [items, query, statusFilter]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setShowEditor(true);
  }

  function openEdit(blog: BlogPost) {
    setEditing(blog);
    setForm({
      title: blog.title,
      shortDescription: blog.shortDescription || "",
      content: blog.content || "",
      imageUrl: blog.imageUrl || "",
      author: blog.author || "",
      category: blog.category || "",
      status: blog.status,
      featured: blog.featured,
      seoTitle: blog.seoTitle || "",
      seoDescription: blog.seoDescription || "",
    });
    setShowEditor(true);
  }

  async function saveBlog(event: React.FormEvent) {
    event.preventDefault();
    if (!form.title.trim()) return alert("Blog title is required.");
    setSaving(true);
    try {
      const response = await adminFetch(editing ? `/api/content/blogs/${editing.id}` : "/api/content/blogs", {
        method: editing ? "PATCH" : "POST",
        body: JSON.stringify(form),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Failed to save blog");
      setShowEditor(false);
      setEditing(null);
      setForm(emptyForm);
      await load();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save blog");
    } finally {
      setSaving(false);
    }
  }

  async function deleteBlog(id: string) {
    if (!confirm("Delete this blog permanently?")) return;
    const response = await adminFetch(`/api/content/blogs/${id}`, { method: "DELETE" });
    const json = await response.json();
    if (!response.ok) return alert(json.error || "Delete failed");
    await load();
  }

  async function shareBlog(blog: BlogPost) {
    const url = `${window.location.origin}/blogs/${blog.id}`;
    try {
      if (navigator.share) await navigator.share({ title: blog.title, text: blog.shortDescription, url });
      else { await navigator.clipboard.writeText(url); alert("Blog link copied."); }
    } catch { /* user cancelled share */ }
  }

  return (
    <div className="min-w-0">
      <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-extrabold text-blue-700"><FileText size={14} /> Content Studio</div>
          <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">Blog Manager</h1>
          <p className="mt-2 max-w-2xl text-slate-500">Create polished articles with rich formatting, Cloudinary images, thumbnails, SEO fields and sharing controls.</p>
        </div>
        <button type="button" onClick={openCreate} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 font-extrabold text-white hover:bg-blue-700"><Plus size={19} /> New Blog</button>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Total" value={items.length} />
        <Stat label="Published" value={items.filter((x) => x.status === "active").length} />
        <Stat label="Featured" value={items.filter((x) => x.featured).length} />
      </div>

      <div className="mb-5 flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row">
        <div className="relative flex-1"><Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search title, category or author..." className="min-h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 outline-none focus:border-blue-400 focus:bg-white" /></div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="min-h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 font-semibold"><option value="all">All status</option><option value="active">Published</option><option value="draft">Draft</option></select>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-slate-50 text-xs font-extrabold uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-4">Blog</th><th className="px-4 py-4">Category</th><th className="px-4 py-4">Status</th><th className="px-4 py-4">Date</th><th className="px-5 py-4 text-right">Actions</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={5} className="p-12 text-center text-slate-500">Loading blogs...</td></tr> : filtered.length === 0 ? <tr><td colSpan={5} className="p-12 text-center text-slate-500">No blogs found.</td></tr> : filtered.map((blog) => (
                <tr key={blog.id} className="border-t border-slate-100 hover:bg-slate-50/70">
                  <td className="px-5 py-4"><div className="flex items-center gap-4"><div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">{blog.imageUrl ? <img src={blog.imageUrl} alt={blog.title} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-xs text-slate-400">No image</div>}</div><div className="min-w-0"><p className="font-black text-slate-950">{blog.title} {blog.featured && <Star size={14} className="ml-1 inline fill-amber-400 text-amber-400" />}</p><p className="mt-1 max-w-[440px] truncate text-sm text-slate-500">{blog.shortDescription}</p></div></div></td>
                  <td className="px-4 py-4 text-sm font-semibold text-slate-600">{blog.category || "—"}</td>
                  <td className="px-4 py-4"><span className={`rounded-full px-3 py-1.5 text-xs font-black ${blog.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{blog.status === "active" ? "Published" : "Draft"}</span></td>
                  <td className="px-4 py-4 text-sm text-slate-500">{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString("en-IN") : "—"}</td>
                  <td className="px-5 py-4"><div className="flex justify-end gap-2">
                    <Link href={`/blogs/${blog.id}`} target="_blank" title="View" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 hover:bg-blue-50 hover:text-blue-700"><Eye size={17} /></Link>
                    <button type="button" title="Edit" onClick={() => openEdit(blog)} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 hover:bg-amber-50 hover:text-amber-700"><Edit3 size={17} /></button>
                    <button type="button" title="Share" onClick={() => void shareBlog(blog)} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 hover:bg-blue-50 hover:text-blue-700"><Share2 size={17} /></button>
                    <button type="button" title="Copy link" onClick={async () => { await navigator.clipboard.writeText(`${window.location.origin}/blogs/${blog.id}`); alert("Link copied."); }} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 hover:bg-slate-100"><Copy size={17} /></button>
                    <button type="button" title="Delete" onClick={() => void deleteBlog(blog.id)} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 text-red-500 hover:bg-red-50"><Trash2 size={17} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showEditor && <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/50 p-3 backdrop-blur-sm md:p-6">
        <div className="mx-auto max-w-6xl rounded-[2rem] bg-white shadow-2xl">
          <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-[2rem] border-b bg-white/95 px-5 py-4 backdrop-blur md:px-7"><div><h2 className="text-2xl font-black">{editing ? "Edit Blog" : "Create Blog"}</h2><p className="text-sm text-slate-500">Write, format, upload and publish from one editor.</p></div><button type="button" onClick={() => !saving && setShowEditor(false)} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"><X /></button></div>
          <form onSubmit={saveBlog} className="grid gap-6 p-5 md:p-7 lg:grid-cols-[1fr_320px]">
            <div className="min-w-0 space-y-5">
              <input value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} required placeholder="Blog title" className="w-full rounded-2xl border border-slate-200 px-5 py-4 text-2xl font-black outline-none focus:border-blue-500" />
              <textarea value={form.shortDescription} onChange={(e) => setForm((s) => ({ ...s, shortDescription: e.target.value }))} placeholder="Short description / excerpt" rows={3} className="w-full rounded-2xl border border-slate-200 p-4 outline-none focus:border-blue-500" />
              <BlogEditor value={form.content} onChange={(content) => setForm((s) => ({ ...s, content }))} />
              <div className="grid gap-4 md:grid-cols-2"><input value={form.author} onChange={(e) => setForm((s) => ({ ...s, author: e.target.value }))} placeholder="Author" className="rounded-xl border p-3.5" /><input value={form.category} onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))} placeholder="Category" className="rounded-xl border p-3.5" /></div>
              <div className="rounded-2xl border border-slate-200 p-4"><p className="mb-3 font-black">SEO</p><input value={form.seoTitle} onChange={(e) => setForm((s) => ({ ...s, seoTitle: e.target.value }))} placeholder="SEO title" className="mb-3 w-full rounded-xl border p-3.5" /><textarea value={form.seoDescription} onChange={(e) => setForm((s) => ({ ...s, seoDescription: e.target.value }))} placeholder="SEO description" rows={3} className="w-full rounded-xl border p-3.5" /></div>
            </div>
            <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              <CloudinaryDropzone label="Blog Thumbnail" name="imageUrl" value={form.imageUrl} onValueChange={(url) => setForm((s) => ({ ...s, imageUrl: url }))} hint="This is the card/cover image shown on the blog listing and article hero." />
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><label className="mb-2 block text-sm font-black">Publishing</label><select value={form.status} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))} className="mb-3 min-h-11 w-full rounded-xl border bg-white px-3"><option value="active">Published</option><option value="draft">Draft</option></select><label className="flex items-center gap-3 font-bold"><input type="checkbox" checked={form.featured} onChange={(e) => setForm((s) => ({ ...s, featured: e.target.checked }))} /> Featured blog</label></div>
              <button disabled={saving} className="w-full rounded-2xl bg-slate-950 py-4 font-black text-white hover:bg-blue-700 disabled:opacity-60">{saving ? "Saving..." : editing ? "Update Blog" : "Publish Blog"}</button>
            </aside>
          </form>
        </div>
      </div>}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm font-semibold text-slate-500">{label}</p><p className="mt-2 text-3xl font-black text-slate-950">{value}</p></div>;
}
