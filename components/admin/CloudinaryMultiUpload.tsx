"use client";

import { useEffect, useRef, useState } from "react";

export type UploadedMedia = {
  url: string;
  name: string;
  type: "image" | "video";
  size: number;
  publicId?: string;
};

type Props = {
  name: string;
  accept?: string;
  maxFiles?: number;
  onChange?: (files: UploadedMedia[]) => void;
  resetKey?: number;
};

function kind(file: File): "image" | "video" {
  return file.type.startsWith("video/") ? "video" : "image";
}

export default function CloudinaryMultiUpload({
  name,
  accept = "image/*,video/*",
  maxFiles = 30,
  onChange,
  resetKey = 0,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<UploadedMedia[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setFiles([]);
    setError("");
    setProgress(0);
    setCurrent("");
    if (inputRef.current) inputRef.current.value = "";
  }, [resetKey]);

  async function uploadOne(file: File, index: number, total: number) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim() || "";
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim() || "";

    if (!cloudName || !uploadPreset) {
      throw new Error(
        "Cloudinary is not configured. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to .env."
      );
    }

    const mediaKind = kind(file);
    const maxBytes = mediaKind === "video" ? 100 * 1024 * 1024 : 25 * 1024 * 1024;

    if (file.size > maxBytes) {
      throw new Error(
        `${file.name}: ${mediaKind} must be ${mediaKind === "video" ? "100 MB" : "25 MB"} or smaller.`
      );
    }

    setCurrent(`Uploading ${index + 1} of ${total}: ${file.name}`);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/${mediaKind}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        data?.error?.message || `Cloudinary upload failed for ${file.name}`
      );
    }

    if (!data?.secure_url) {
      throw new Error(`Cloudinary did not return a secure URL for ${file.name}`);
    }

    setProgress(Math.round(((index + 1) / total) * 100));

    return {
      url: String(data.secure_url),
      name: file.name,
      type: mediaKind,
      size: file.size,
      publicId: typeof data.public_id === "string" ? data.public_id : undefined,
    } satisfies UploadedMedia;
  }

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files || []);
    if (!selected.length) return;

    setError("");

    if (selected.length + files.length > maxFiles) {
      setError(`You can keep up to ${maxFiles} files in one gallery batch.`);
      event.target.value = "";
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const uploaded: UploadedMedia[] = [];

      for (let index = 0; index < selected.length; index += 1) {
        uploaded.push(await uploadOne(selected[index], index, selected.length));
      }

      // Build the next value first. Do not call the parent's setState from
      // inside a React state updater; doing that causes the React warning:
      // "Cannot update a component while rendering a different component."
      const nextFiles = [...files, ...uploaded];
      setFiles(nextFiles);
      onChange?.(nextFiles);
      setProgress(100);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Upload failed. Please try again."
      );
    } finally {
      setUploading(false);
      setCurrent("");
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(index: number) {
    const nextFiles = files.filter((_, fileIndex) => fileIndex !== index);
    setFiles(nextFiles);
    onChange?.(nextFiles);
  }

  return (
    <div className="w-full min-w-0 max-w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <input type="hidden" name={name} value={JSON.stringify(files)} />

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={handleChange}
      />

      <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="font-black text-slate-950">Gallery Media</p>
          <p className="mt-1 max-w-full text-xs leading-5 text-slate-500">
            Select any mix of images and videos. Files upload directly to Cloudinary.
          </p>
        </div>

        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="min-h-11 w-full max-w-full shrink-0 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60 sm:w-auto"
        >
          {uploading ? `Uploading ${progress}%` : "Choose Images / Videos"}
        </button>
      </div>

      {uploading && (
        <div className="mt-4 w-full min-w-0">
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          {current && (
            <p className="mt-2 w-full max-w-full truncate text-xs font-semibold text-slate-500">
              {current}
            </p>
          )}
        </div>
      )}

      {error && (
        <p className="mt-3 w-full max-w-full break-words rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}

      {files.length > 0 && (
        <div className="mt-4 grid w-full min-w-0 max-w-full grid-cols-2 gap-3 overflow-hidden sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
          {files.map((file, index) => (
            <div
              key={`${file.url}-${index}`}
              className="min-w-0 max-w-full overflow-hidden rounded-xl border bg-white"
            >
              <div className="aspect-square min-w-0 overflow-hidden bg-slate-950">
                {file.type === "video" ? (
                  <video
                    src={file.url}
                    muted
                    playsInline
                    preload="metadata"
                    className="h-full w-full max-w-full object-contain"
                  />
                ) : (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="h-full w-full max-w-full object-cover"
                  />
                )}
              </div>

              <div className="flex min-w-0 max-w-full items-center justify-between gap-2 p-2">
                <span className="min-w-0 flex-1 truncate text-[11px] font-bold text-slate-600">
                  {file.name}
                </span>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="shrink-0 whitespace-nowrap text-[11px] font-black text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
