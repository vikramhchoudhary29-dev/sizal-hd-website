"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import WebsiteNavbar from "@/components/website/WebsiteNavbar";
import Footer from "@/components/layout/Footer";
import { BlogPost } from "@/types/blog";

export default function BlogDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlog() {
      const response = await fetch(`/api/content/blogs/${id}`, { cache: "no-store" });
      const json = response.ok ? await response.json() : { data: null };
      const data = json.data || null;
      setBlog(data);
      setLoading(false);
    }

    loadBlog();
  }, [id]);

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center">Loading...</main>;
  }

  if (!blog) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-5">
        <h1 className="text-4xl font-black">Blog Not Found</h1>
        <Link href="/blogs" className="rounded-xl bg-blue-600 px-6 py-3 text-white">
          Back to Blogs
        </Link>
      </main>
    );
  }

  return (
    <>
      <WebsiteNavbar />

      <main className="min-h-screen bg-[#F8FBFF] px-6 pb-20 pt-40 md:px-20">
        <article className="mx-auto max-w-4xl">
          <div className="mb-8 text-sm font-bold text-slate-500">
            <Link href="/">Home</Link> / <Link href="/blogs">Blogs</Link> / {blog.title}
          </div>

          <span className="mb-5 inline-block rounded-full bg-blue-50 px-4 py-2 text-xs font-black tracking-[0.2em] text-blue-600">
            {blog.category || "BLOG"}
          </span>

          <h1 className="text-5xl font-black tracking-tight md:text-7xl">
            {blog.title}
          </h1>

          <p className="mt-5 text-slate-500">By {blog.author || "Sizal HD"}</p>

          {blog.imageUrl && (
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="mt-10 h-[440px] w-full rounded-[2rem] object-cover"
            />
          )}

          <div className="mt-10 rounded-[2rem] border bg-white p-8 shadow-sm">
            <p className="whitespace-pre-line text-lg leading-9 text-slate-700">
              {blog.content}
            </p>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}