"use client";

import { useRef, useState } from "react";
import { FileImage, FileText, Film, UploadCloud, X } from "lucide-react";

type ResourceType = "image" | "video" | "raw";

type Props = {
  label: string;
  name: string;
  value?: string;
  resourceType?: ResourceType;
  accept?: string;
  maxMb?: number;
  hint?: string;
  onValueChange?: (url: string) => void;
};

function iconFor(resourceType: ResourceType) {
  if (resourceType === "video") return Film;
  if (resourceType === "raw") return FileText;
  return FileImage;
}

export default function CloudinaryDropzone({
  label,
  name,
  value = "",
  resourceType = "image",
  accept,
  maxMb,
  hint,
  onValueChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [url, setUrl] = useState(value);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const Icon = iconFor(resourceType);

  function setUploadedUrl(next: string) {
    setUrl(next);
    onValueChange?.(next);
  }

  async function upload(file: File) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim() || "";
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim() || "";

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary is not configured. Add the Cloudinary environment variables in Vercel.");
    }

    const limit = (maxMb ?? (resourceType === "video" ? 100 : 25)) * 1024 * 1024;
    if (file.size > limit) {
      throw new Error(`${label} must be ${maxMb ?? (resourceType === "video" ? 100 : 25)} MB or smaller.`);
    }

    setUploading(true);
    setProgress(15);
    setError("");

    try {
      const body = new FormData();
      body.append("file", file);
      body.append("upload_preset", uploadPreset);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/${resourceType}/upload`,
        { method: "POST", body }
      );
      setProgress(75);
      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.secure_url) {
        throw new Error(data?.error?.message || "Cloudinary upload failed.");
      }

      setUploadedUrl(String(data.secure_url));
      setProgress(100);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleFiles(files: FileList | File[]) {
    const file = Array.from(files)[0];
    if (!file) return;

    try {
      await upload(file);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
      setProgress(0);
    }
  }

  function clear() {
    setUploadedUrl("");
    setError("");
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <input type="hidden" name={name} value={url} />
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept || (resourceType === "image" ? "image/*" : resourceType === "video" ? "video/*" : "application/pdf,.pdf")}
        onChange={(event) => void handleFiles(event.target.files || [])}
      />

      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="font-black text-slate-900">{label}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {hint || "Drag & drop a file here or click to browse. Files upload directly to Cloudinary."}
          </p>
        </div>
        {url && (
          <button type="button" onClick={clear} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label={`Remove ${label}`}>
            <X size={17} />
          </button>
        )}
      </div>

      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => { event.preventDefault(); setDragging(false); void handleFiles(event.dataTransfer.files); }}
        className={`flex min-h-32 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-6 text-center transition ${dragging ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50/40"}`}
      >
        <div className="mb-3 rounded-2xl bg-slate-100 p-3 text-slate-700">
          {url ? <Icon size={25} /> : <UploadCloud size={25} />}
        </div>
        <p className="text-sm font-black text-slate-800">{uploading ? `Uploading ${progress}%` : url ? "Replace file" : "Drop file here"}</p>
        {!uploading && <p className="mt-1 text-xs text-slate-500">or click to choose a file</p>}
      </button>

      {uploading && <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200"><div className="h-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} /></div>}
      {error && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}

      {url && (
        <div className="mt-4 overflow-hidden rounded-2xl border bg-white">
          {resourceType === "image" && <img src={url} alt={label} className="h-40 w-full object-cover" />}
          {resourceType === "video" && <video src={url} controls className="h-40 w-full bg-slate-950 object-contain" />}
          {resourceType === "raw" && <div className="flex items-center gap-3 p-4"><FileText className="text-red-600" /><a href={url} target="_blank" rel="noreferrer" className="truncate text-sm font-bold text-blue-600">View uploaded PDF</a></div>}
        </div>
      )}
    </div>
  );
}
