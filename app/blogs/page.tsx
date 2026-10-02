"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import WebsiteNavbar from "@/components/website/WebsiteNavbar";
import Footer from "@/components/layout/Footer";
import { BlogPost } from "@/types/blog";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlogs() {
      const response = await fetch("/api/content/blogs?active=true", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to load blogs");
      const json = await response.json();
      const data = json.data || [];
      setBlogs(data);
      setLoading(false);
    }

    loadBlogs();
  }, []);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) =>
      blog.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [blogs, search]);

  return (
    <>
      <WebsiteNavbar />

      <main className="min-h-screen bg-[#F8FBFF] px-6 pb-20 pt-40 md:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-4 text-xs font-black tracking-[0.3em] text-blue-600">
              NEWS & ARTICLES
            </p>

            <h1 className="text-5xl font-black tracking-tight md:text-7xl">
              Sizal HD Blogs
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Latest updates, lens knowledge and optical industry insights.
            </p>
          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search blogs..."
            className="mb-10 w-full rounded-2xl border bg-white p-4 outline-none focus:border-blue-600"
          />

          {loading ? (
            <p className="text-center text-slate-500">Loading blogs...</p>
          ) : filteredBlogs.length === 0 ? (
            <p className="text-center text-slate-500">No blogs found.</p>
          ) : (
            <div className="grid gap-7 md:grid-cols-3">
              {filteredBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blogs/${blog.id}`}
                  className="overflow-hidden rounded-[2rem] border bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
                >
                  {blog.imageUrl ? (
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="h-60 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-60 items-center justify-center bg-slate-100 text-slate-400">
                      No Image
                    </div>
                  )}

                  <div className="p-7">
                    <span className="mb-4 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600">
                      {blog.category || "Blog"}
                    </span>

                    <h2 className="text-2xl font-black">{blog.title}</h2>

                    <p className="mt-3 line-clamp-2 text-slate-600">
                      {blog.shortDescription}
                    </p>

                    <p className="mt-6 font-bold text-blue-600">
                      Read More →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}