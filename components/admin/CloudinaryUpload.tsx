"use client";

import { useRef, useState } from "react";

type CloudinaryUploadProps = {
  label: string;
  name: string;
  value?: string;
  resourceType?: "image" | "video" | "raw";
};

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim() || "";
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim() || "";

export default function CloudinaryUpload({
  label,
  name,
  value = "",
  resourceType = "image",
}: CloudinaryUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [url, setUrl] = useState(value);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      alert("Cloudinary upload is not configured. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to Vercel.");
      return;
    }

    const maxBytes = resourceType === "video"
      ? 100 * 1024 * 1024
      : resourceType === "raw"
        ? 25 * 1024 * 1024
        : 25 * 1024 * 1024;

    if (file.size > maxBytes) {
      alert(`${label} must be ${resourceType === "video" ? "100 MB" : "25 MB"} or smaller.`);
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${encodeURIComponent(CLOUD_NAME)}/${resourceType}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      setProgress(70);
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error?.message || "Cloudinary upload failed");
      }

      if (!data?.secure_url) {
        throw new Error("Cloudinary did not return a secure URL.");
      }

      setUrl(String(data.secure_url));
      setProgress(100);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Cloudinary upload failed");
      setProgress(0);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="rounded-2xl border bg-slate-50 p-4">
      <p className="mb-1 font-bold text-slate-800">{label}</p>
      <p className="mb-3 text-xs text-slate-500">Upload directly to Cloudinary. This no longer uses Firebase Storage.</p>

      <input type="hidden" name={name} value={url} />

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept={
          resourceType === "image"
            ? "image/*"
            : resourceType === "video"
              ? "video/*"
              : "application/pdf,.pdf"
        }
      />

      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
      >
        {uploading ? `Uploading ${progress}%` : url ? "Replace File" : "Upload File"}
      </button>

      {uploading && (
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}

      {url && (
        <div className="mt-4">
          <p className="mb-2 break-all text-xs text-slate-500">{url}</p>

          {resourceType === "image" && (
            <img src={url} alt={label} className="h-32 w-full rounded-xl object-cover" />
          )}

          {resourceType === "video" && (
            <video src={url} controls className="h-40 w-full rounded-xl object-contain bg-slate-950" />
          )}

          {resourceType === "raw" && (
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-600">
              View uploaded PDF
            </a>
          )}
        </div>
      )}
    </div>
  );
}
