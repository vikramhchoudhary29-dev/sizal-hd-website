"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Search, Sparkles } from "lucide-react";
import WebsiteNavbar from "@/components/website/WebsiteNavbar";
import Footer from "@/components/layout/Footer";
import { BlogPost } from "@/types/blog";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content/blogs?active=true", { cache: "no-store" })
      .then((response) => response.json())
      .then((json) => setBlogs(Array.isArray(json.data) ? json.data : []))
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => ["all", ...Array.from(new Set(blogs.map((blog) => blog.category).filter(Boolean)))], [blogs]);
  const featured = blogs.find((blog) => blog.featured) || blogs[0];
  const filtered = blogs.filter((blog) => {
    const q = search.trim().toLowerCase();
    return (category === "all" || blog.category === category) && (!q || [blog.title, blog.shortDescription, blog.category, blog.author].some((value) => value.toLowerCase().includes(q)));
  });
  const cards = featured ? filtered.filter((blog) => blog.id !== featured.id) : filtered;

  return <>
    <WebsiteNavbar />
    <main className="min-h-screen bg-[#f7faff] px-5 pb-24 pt-36 md:px-10 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <section className="mb-14 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-xs font-black tracking-[0.25em] text-blue-600 shadow-sm"><Sparkles size={14} /> SIZAL HD INSIGHTS</div>
          <h1 className="text-5xl font-black tracking-[-0.04em] text-slate-950 md:text-7xl">The Sizal HD Journal</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">Lens knowledge, product stories, optical insights and company updates — written for modern eye-care professionals.</p>
        </section>

        {featured && !search && category === "all" && <Link href={`/blogs/${featured.id}`} className="group mb-12 grid overflow-hidden rounded-[2rem] border border-white bg-white shadow-xl shadow-blue-900/5 lg:grid-cols-[1.25fr_1fr]">
          <div className="min-h-[300px] overflow-hidden bg-slate-100">{featured.imageUrl ? <img src={featured.imageUrl} alt={featured.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /> : <div className="flex h-full min-h-[300px] items-center justify-center text-slate-400">No Image</div>}</div>
          <div className="flex flex-col justify-center p-8 md:p-12"><span className="mb-5 w-fit rounded-full bg-blue-50 px-4 py-2 text-xs font-black tracking-[0.2em] text-blue-700">FEATURED ARTICLE</span><h2 className="text-3xl font-black leading-tight text-slate-950 md:text-5xl">{featured.title}</h2><p className="mt-5 text-base leading-7 text-slate-600">{featured.shortDescription}</p><div className="mt-8 inline-flex items-center gap-2 font-black text-blue-600">Read article <ArrowRight size={18} className="transition group-hover:translate-x-1" /></div></div>
        </Link>}

        <div className="mb-9 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row">
          <div className="relative flex-1"><Search size={19} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search articles..." className="min-h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 outline-none focus:border-blue-400 focus:bg-white" /></div>
          <div className="flex gap-2 overflow-x-auto pb-1">{categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-2xl px-4 py-3 text-sm font-black transition ${category === item ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700"}`}>{item === "all" ? "All Articles" : item}</button>)}</div>
        </div>

        {loading ? <div className="py-20 text-center text-slate-500">Loading articles...</div> : cards.length === 0 && (!featured || search || category !== "all") ? <div className="rounded-3xl border bg-white p-16 text-center text-slate-500">No articles found.</div> : <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">{cards.map((blog) => <Link key={blog.id} href={`/blogs/${blog.id}`} className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
          <div className="h-56 overflow-hidden bg-slate-100">{blog.imageUrl ? <img src={blog.imageUrl} alt={blog.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-slate-400">No Image</div>}</div>
          <div className="p-6"><div className="flex items-center justify-between gap-3"><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">{blog.category || "Blog"}</span>{blog.createdAt && <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400"><CalendarDays size={13} />{new Date(blog.createdAt).toLocaleDateString("en-IN")}</span>}</div><h2 className="mt-4 text-2xl font-black leading-tight text-slate-950">{blog.title}</h2><p className="mt-3 line-clamp-3 leading-7 text-slate-600">{blog.shortDescription}</p><div className="mt-6 font-black text-blue-600">Read More <ArrowRight size={16} className="ml-1 inline transition group-hover:translate-x-1" /></div></div>
        </Link>)}</div>}
      </div>
    </main>
    <Footer />
  </>;
}
