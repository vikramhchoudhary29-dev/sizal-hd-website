"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Copy, Share2 } from "lucide-react";
import WebsiteNavbar from "@/components/website/WebsiteNavbar";
import Footer from "@/components/layout/Footer";
import { BlogPost } from "@/types/blog";

export default function BlogDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/content/blogs/${id}`, { cache: "no-store" }).then((response) => response.json()).then((json) => setBlog(json.data || null)).catch(() => setBlog(null)).finally(() => setLoading(false));
  }, [id]);

  async function share() {
    if (!blog) return;
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: blog.title, text: blog.shortDescription, url });
      else { await navigator.clipboard.writeText(url); alert("Article link copied."); }
    } catch { /* cancelled */ }
  }

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-[#f7faff] text-slate-500">Loading article...</main>;
  if (!blog) return <main className="flex min-h-screen flex-col items-center justify-center gap-5"><h1 className="text-4xl font-black">Article Not Found</h1><Link href="/blogs" className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white">Back to Blogs</Link></main>;

  return <>
    <WebsiteNavbar />
    <main className="min-h-screen bg-[#f7faff] px-5 pb-24 pt-36 md:px-10">
      <article className="mx-auto max-w-5xl">
        <Link href="/blogs" className="mb-8 inline-flex items-center gap-2 text-sm font-black text-slate-500 hover:text-blue-600"><ArrowLeft size={16} /> Back to Journal</Link>
        <div className="mb-8 text-center"><span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-black tracking-[0.2em] text-blue-700">{blog.category || "BLOG"}</span><h1 className="mx-auto mt-5 max-w-4xl text-4xl font-black leading-tight tracking-[-0.04em] text-slate-950 md:text-6xl">{blog.title}</h1><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">{blog.shortDescription}</p><div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-slate-500"><span>By {blog.author || "Sizal HD"}</span>{blog.createdAt && <span className="inline-flex items-center gap-1"><CalendarDays size={15} />{new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</span>}</div></div>
        {blog.imageUrl && <div className="mb-10 overflow-hidden rounded-[2rem] border border-white bg-white shadow-xl"><img src={blog.imageUrl} alt={blog.title} className="max-h-[620px] w-full object-cover" /></div>}
        <div className="mb-6 flex justify-end gap-2"><button type="button" onClick={() => void share()} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 hover:bg-blue-50 hover:text-blue-700"><Share2 size={16} /> Share</button><button type="button" onClick={async () => { await navigator.clipboard.writeText(window.location.href); alert("Link copied."); }} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 hover:bg-slate-50"><Copy size={16} /> Copy link</button></div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm md:p-12"><div className="blog-article-content" dangerouslySetInnerHTML={{ __html: blog.content || "<p>No content available.</p>" }} /></div>
      </article>
    </main>
    <Footer />
  </>;
}
