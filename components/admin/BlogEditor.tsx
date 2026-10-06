"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Palette,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
} from "lucide-react";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim() || "";
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim() || "";

export default function BlogEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [fontSize, setFontSize] = useState("3");
  const [color, setColor] = useState("#0f172a");
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) editorRef.current.innerHTML = value || "";
  }, [value]);

  function focusEditor() {
    editorRef.current?.focus();
  }

  function command(command: string, argument?: string) {
    focusEditor();
    document.execCommand(command, false, argument);
    onChange(editorRef.current?.innerHTML || "");
  }

  function formatBlock(value: string) {
    command("formatBlock", value);
  }

  async function uploadImage(file: File) {
    if (!CLOUD_NAME || !UPLOAD_PRESET) throw new Error("Cloudinary is not configured.");
    if (file.size > 25 * 1024 * 1024) throw new Error("Blog images must be 25 MB or smaller.");

    const body = new FormData();
    body.append("file", file);
    body.append("upload_preset", UPLOAD_PRESET);
    const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(CLOUD_NAME)}/image/upload`, { method: "POST", body });
    const data = await response.json().catch(() => null);
    if (!response.ok || !data?.secure_url) throw new Error(data?.error?.message || "Cloudinary upload failed.");
    return String(data.secure_url);
  }

  async function insertImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      setUploadingImage(true);
      const url = await uploadImage(file);
      focusEditor();
      document.execCommand("insertHTML", false, `<img src="${url.replace(/"/g, "&quot;")}" alt="Blog image" style="max-width:100%;height:auto;border-radius:16px;margin:24px 0;display:block" />`);
      onChange(editorRef.current?.innerHTML || "");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setUploadingImage(false);
    }
  }

  function insertLink() {
    const url = window.prompt("Enter URL");
    if (!url) return;
    command("createLink", url);
  }

  const button = (label: string, action: () => void, icon: React.ReactNode) => (
    <button type="button" title={label} onMouseDown={(event) => event.preventDefault()} onClick={action} className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-blue-700">
      {icon}
    </button>
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b bg-slate-50 p-2">
        <select value={fontSize} onChange={(e) => { setFontSize(e.target.value); command("fontSize", e.target.value); }} className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm font-semibold">
          <option value="2">Small</option><option value="3">Normal</option><option value="4">Large</option><option value="5">XL</option><option value="6">XXL</option>
        </select>
        <select defaultValue="P" onChange={(e) => formatBlock(e.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm font-semibold">
          <option value="P">Paragraph</option><option value="H2">Heading 2</option><option value="H3">Heading 3</option><option value="BLOCKQUOTE">Quote</option>
        </select>
        {button("Bold", () => command("bold"), <Bold size={17} />)}
        {button("Italic", () => command("italic"), <Italic size={17} />)}
        {button("Underline", () => command("underline"), <Underline size={17} />)}
        {button("Strikethrough", () => command("strikeThrough"), <Strikethrough size={17} />)}
        <label title="Text colour" className="relative inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100">
          <Palette size={17} /><input type="color" value={color} onChange={(e) => { setColor(e.target.value); command("foreColor", e.target.value); }} className="absolute inset-0 cursor-pointer opacity-0" />
        </label>
        {button("Align left", () => command("justifyLeft"), <AlignLeft size={17} />)}
        {button("Align center", () => command("justifyCenter"), <AlignCenter size={17} />)}
        {button("Align right", () => command("justifyRight"), <AlignRight size={17} />)}
        {button("Bullet list", () => command("insertUnorderedList"), <List size={17} />)}
        {button("Numbered list", () => command("insertOrderedList"), <ListOrdered size={17} />)}
        {button("Insert link", insertLink, <LinkIcon size={17} />)}
        <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={insertImage} />
        {button(uploadingImage ? "Uploading image..." : "Insert image", () => imageInputRef.current?.click(), <ImagePlus size={17} />)}
        {button("Divider", () => command("insertHTML", "<hr style=\"margin:28px 0;border:0;border-top:1px solid #e2e8f0\" />"), <Minus size={17} />)}
        <span className="mx-1 h-6 w-px bg-slate-200" />
        {button("Undo", () => command("undo"), <Undo2 size={17} />)}
        {button("Redo", () => command("redo"), <Redo2 size={17} />)}
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={(event) => onChange(event.currentTarget.innerHTML)}
        className="min-h-[430px] px-6 py-5 text-base leading-8 text-slate-700 outline-none [&_blockquote]:my-5 [&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:pl-5 [&_blockquote]:italic [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-3xl [&_h2]:font-black [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-2xl [&_h3]:font-black [&_img]:max-w-full [&_li]:ml-6 [&_li]:list-disc [&_ol_li]:list-decimal [&_p]:mb-4"
        data-placeholder="Write your blog here..."
      />
      <div className="border-t bg-slate-50 px-5 py-3 text-xs font-semibold text-slate-500">You can format text, change colour/size, add links, lists, headings, dividers and upload images directly into the article. Images are stored in Cloudinary.</div>
    </div>
  );
}
