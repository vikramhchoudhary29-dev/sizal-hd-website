"use client";

import { useRef, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { auth } from "@/firebase/auth";
import { app } from "@/firebase/firebaseConfig";

export type UploadedMedia = {
  url: string;
  name: string;
  type: "image" | "video";
  size: number;
};

type Props = {
  name: string;
  folder: string;
  accept?: string;
  maxFiles?: number;
};

const storage = getStorage(app);

function kind(file: File): "image" | "video" {
  return file.type.startsWith("video/") ? "video" : "image";
}

export default function FirebaseMultiUpload({ name, folder, accept = "image/*,video/*", maxFiles = 30 }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<UploadedMedia[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState("");
  const [error, setError] = useState("");

  async function uploadOne(file: File, index: number, total: number) {
    const user = auth.currentUser;
    if (!user) throw new Error("Please sign in to the admin panel before uploading files.");

    const mediaKind = kind(file);
    const maxBytes = mediaKind === "video" ? 100 * 1024 * 1024 : 25 * 1024 * 1024;
    if (file.size > maxBytes) {
      throw new Error(`${file.name}: ${mediaKind === "video" ? "video" : "image"} must be ${mediaKind === "video" ? "100 MB" : "25 MB"} or smaller.`);
    }

    setCurrent(`Uploading ${index + 1} of ${total}: ${file.name}`);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `${folder}/${user.uid}/${Date.now()}-${index}-${safeName}`;
    const storageRef = ref(storage, path);
    const task = uploadBytesResumable(storageRef, file, {
      contentType: file.type || undefined,
      cacheControl: "public,max-age=31536000,immutable",
    });

    await new Promise<void>((resolve, reject) => {
      task.on(
        "state_changed",
        (snapshot) => {
          const fileProgress = snapshot.totalBytes ? snapshot.bytesTransferred / snapshot.totalBytes : 0;
          setProgress(Math.round(((index + fileProgress) / total) * 100));
        },
        reject,
        () => resolve(),
      );
    });

    return {
      url: await getDownloadURL(task.snapshot.ref),
      name: file.name,
      type: mediaKind,
      size: file.size,
    } satisfies UploadedMedia;
  }

  async function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files || []);
    if (!selected.length) return;

    setError("");
    if (selected.length > maxFiles) {
      setError(`You can upload up to ${maxFiles} files at once.`);
      return;
    }

    setUploading(true);
    setProgress(0);
    try {
      const uploaded: UploadedMedia[] = [];
      for (let i = 0; i < selected.length; i += 1) {
        uploaded.push(await uploadOne(selected[i], i, selected.length));
      }
      setFiles((currentFiles) => [...currentFiles, ...uploaded]);
      setProgress(100);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setCurrent("");
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(index: number) {
    setFiles((currentFiles) => currentFiles.filter((_, fileIndex) => fileIndex !== index));
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <input type="hidden" name={name} value={JSON.stringify(files)} />
      <input ref={inputRef} type="file" accept={accept} multiple className="hidden" onChange={handleChange} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-black text-slate-950">Gallery Media</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">Select multiple images and videos together. Files upload directly to Firebase Storage.</p>
        </div>
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="min-h-11 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
        >
          {uploading ? `Uploading ${progress}%` : "Choose Images / Videos"}
        </button>
      </div>

      {uploading && (
        <div className="mt-4">
          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
          {current && <p className="mt-2 truncate text-xs font-semibold text-slate-500">{current}</p>}
        </div>
      )}

      {error && <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}

      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {files.map((file, index) => (
            <div key={`${file.url}-${index}`} className="overflow-hidden rounded-xl border bg-white">
              <div className="aspect-square bg-slate-950">
                {file.type === "video" ? (
                  <video src={file.url} muted playsInline preload="metadata" className="h-full w-full object-contain" />
                ) : (
                  <img src={file.url} alt={file.name} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="flex items-center justify-between gap-2 p-2">
                <span className="truncate text-[11px] font-bold text-slate-600">{file.name}</span>
                <button type="button" onClick={() => remove(index)} className="shrink-0 text-[11px] font-black text-red-600">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
