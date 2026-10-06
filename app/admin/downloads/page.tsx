"use client";

import { useEffect, useState } from "react";
import { FileDown, Trash2 } from "lucide-react";
import { DownloadItem } from "@/types/download";
import { adminFetch } from "@/lib/api/adminToken";
import CloudinaryDropzone from "@/components/admin/CloudinaryDropzone";

export default function DownloadsPage() {
  const [items, setItems] = useState<DownloadItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [fileUrl, setFileUrl] = useState("");

  async function load() {
    const response = await fetch("/api/content/downloads", { cache: "no-store" });
    const json = await response.json();
    setItems(json.data || []);
  }

  useEffect(() => { void load(); }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!fileUrl) return alert("Please upload the PDF/file first.");
    setSaving(true);
    try {
      const form = new FormData(event.currentTarget);
      const body = Object.fromEntries(form.entries());
      body.fileUrl = fileUrl;
      body.featured = form.get("featured") === "on" ? "true" : "false";
      const response = await adminFetch("/api/content/downloads", { method: "POST", body: JSON.stringify(body) });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Failed to save download");
      event.currentTarget.reset();
      setFileUrl("");
      await load();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save download");
    } finally {
      setSaving(false);
    }
  }

  async function del(id: string) {
    if (!confirm("Delete this download?")) return;
    const response = await adminFetch(`/api/content/downloads/${id}`, { method: "DELETE" });
    const json = await response.json();
    if (!response.ok) return alert(json.error || "Delete failed");
    await load();
  }

  return (
    <div className="min-w-0">
      <div className="mb-8"><div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-extrabold text-blue-700"><FileDown size={14} /> Documents</div><h1 className="text-4xl font-black">Downloads</h1><p className="mt-2 text-slate-500">Manage catalogues, price lists and documents. Files are uploaded directly to Cloudinary.</p></div>
      <div className="grid gap-8 xl:grid-cols-[390px_1fr]">
        <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-2xl font-black">Add Download</h2>
          <input name="title" required placeholder="Document Title" className="mb-4 w-full rounded-xl border p-4" />
          <input name="type" placeholder="Type (PDF, Catalogue, Price List...)" className="mb-4 w-full rounded-xl border p-4" />
          <input name="category" placeholder="Category / Product" className="mb-4 w-full rounded-xl border p-4" />
          <CloudinaryDropzone label="Document / PDF" name="fileUrl" value={fileUrl} onValueChange={setFileUrl} resourceType="raw" accept="application/pdf,.pdf" maxMb={25} hint="Drag & drop a PDF here or click to browse. It will be stored in Cloudinary." />
          <select name="status" defaultValue="active" className="my-4 w-full rounded-xl border p-4"><option value="active">Active</option><option value="draft">Draft</option></select>
          <label className="mb-6 flex items-center gap-3 font-bold"><input name="featured" type="checkbox" /> Featured</label>
          <button disabled={saving} className="w-full rounded-xl bg-blue-600 py-4 font-bold text-white disabled:opacity-60">{saving ? "Saving..." : "Save Download"}</button>
        </form>

        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[720px] text-left"><thead className="bg-slate-50"><tr className="border-b text-sm text-slate-500"><th className="px-6 py-4">Title</th><th>Type</th><th>Category</th><th>Status</th><th>File</th><th className="pr-6">Actions</th></tr></thead><tbody>{items.map((item) => <tr key={item.id} className="border-b"><td className="px-6 py-5 font-black">{item.title}</td><td>{item.type || "—"}</td><td>{item.category || "—"}</td><td>{item.status}</td><td><a href={item.fileUrl} target="_blank" rel="noreferrer" className="font-bold text-blue-600">View</a></td><td className="pr-6"><button onClick={() => void del(item.id)} className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-bold text-red-600"><Trash2 size={15} /> Delete</button></td></tr>)}</tbody></table>
        </div>
      </div>
    </div>
  );
}
