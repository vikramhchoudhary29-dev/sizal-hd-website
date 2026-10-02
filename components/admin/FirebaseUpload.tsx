"use client";

import { useRef, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { auth } from "@/firebase/auth";
import { app } from "@/firebase/firebaseConfig";

export type FirebaseUploadProps = {
  label: string;
  name: string;
  value?: string;
  accept: string;
  folder: string;
  mediaKind?: "image" | "video" | "file";
  required?: boolean;
};

const storage = getStorage(app);

export default function FirebaseUpload({
  label,
  name,
  value = "",
  accept,
  folder,
  mediaKind = "image",
  required = false,
}: FirebaseUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [url, setUrl] = useState(value);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const user = auth.currentUser;
    if (!user) {
      alert("Please sign in to the admin panel before uploading files.");
      return;
    }

    const maxBytes = mediaKind === "video" ? 100 * 1024 * 1024 : 25 * 1024 * 1024;
    if (file.size > maxBytes) {
      alert(
        mediaKind === "video"
          ? "Video must be 100 MB or smaller."
          : "File must be 25 MB or smaller."
      );
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const path = `${folder}/${user.uid}/${Date.now()}-${safeName}`;
      const storageRef = ref(storage, path);
      const task = uploadBytesResumable(storageRef, file, {
        contentType: file.type || undefined,
        cacheControl: "public,max-age=31536000,immutable",
      });

      await new Promise<void>((resolve, reject) => {
        task.on(
          "state_changed",
          (snapshot) => {
            setProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
          },
          reject,
          () => resolve()
        );
      });

      const downloadUrl = await getDownloadURL(task.snapshot.ref);
      setUrl(downloadUrl);
      setProgress(100);
    } catch (error) {
      console.error("Firebase upload failed:", error);
      alert(error instanceof Error ? error.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="font-bold text-slate-900">{label}</p>
          <p className="mt-1 text-xs text-slate-500">Upload directly from your computer</p>
        </div>
        {url && (
          <button
            type="button"
            onClick={() => setUrl("")}
            className="text-xs font-bold text-red-600"
          >
            Remove
          </button>
        )}
      </div>

      <input type="hidden" name={name} value={url} required={required} />

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
      >
        {uploading ? `Uploading ${progress}%` : url ? "Replace File" : "Choose File"}
      </button>

      {uploading && (
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}

      {url && (
        <div className="mt-4 overflow-hidden rounded-xl border bg-white">
          {mediaKind === "image" && (
            <img src={url} alt={label} className="h-40 w-full object-contain bg-slate-100" />
          )}
          {mediaKind === "video" && (
            <video src={url} controls playsInline className="h-40 w-full bg-slate-950 object-contain" />
          )}
          {mediaKind === "file" && (
            <div className="p-4 text-sm font-semibold text-slate-700">File uploaded successfully.</div>
          )}
        </div>
      )}
    </div>
  );
}
