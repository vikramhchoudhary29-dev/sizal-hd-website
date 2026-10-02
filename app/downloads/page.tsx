"use client";

import { useEffect, useMemo, useState } from "react";
import WebsiteNavbar from "@/components/website/WebsiteNavbar";
import Footer from "@/components/layout/Footer";
import { DownloadItem } from "@/types/download";

export default function DownloadsPage() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/content/downloads?active=true", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to load downloads");
      const json = await response.json();
      const data = json.data || [];
      setDownloads(data);
      setLoading(false);
    }

    load();
  }, []);

  const filtered = useMemo(() => {
    return downloads.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [downloads, search]);

  return (
    <>
      <WebsiteNavbar />

      <main className="min-h-screen bg-slate-50 pt-36 pb-20">

        <div className="mx-auto max-w-7xl px-6">

          <div className="mb-12 text-center">

            <p className="font-bold tracking-[0.3em] text-blue-600">
              DOWNLOADS
            </p>

            <h1 className="mt-3 text-6xl font-black">
              Product Documents
            </h1>

            <p className="mt-4 text-slate-600">
              Catalogues, brochures, price lists and technical sheets.
            </p>

          </div>

          <input
            className="mb-10 w-full rounded-2xl border bg-white p-4"
            placeholder="Search downloads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {loading ? (
            <p>Loading...</p>
          ) : filtered.length === 0 ? (
            <p>No downloads available.</p>
          ) : (
            <div className="grid gap-6">

              {filtered.map((item) => (

                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-3xl bg-white p-7 shadow"
                >

                  <div>

                    <h2 className="text-2xl font-black">
                      {item.title}
                    </h2>

                    <p className="mt-2 text-slate-500">
                      {item.type}
                    </p>

                  </div>

                  <a
                    href={item.fileUrl}
                    target="_blank"
                    className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white"
                  >
                    Download
                  </a>

                </div>

              ))}

            </div>
          )}

        </div>

      </main>

      <Footer />
    </>
  );
}