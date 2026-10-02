"use client";

import {
  Activity,
  ArrowRight,
  CloudUpload,
  Download,
  FileText,
  FolderTree,
  Image,
  Package,
  Plus,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/api/adminToken";

type Counts = {
  products: number;
  categories: number;
  dealers: number;
  downloads: number;
  gallery: number;
  blogs: number;
};

type ActivityLog = {
  id: string;
  action: string;
  message: string;
  createdAt?: string;
};

type QuickAction = {
  title: string;
  href: string;
  icon: LucideIcon;
};

type DashboardCard = {
  title: string;
  value: number;
  icon: LucideIcon;
  href: string;
};

const quick: QuickAction[] = [
  {
    title: "Add Product",
    href: "/admin/products/new",
    icon: Plus,
  },
  {
    title: "Manage Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Upload Catalogue",
    href: "/admin/downloads",
    icon: CloudUpload,
  },
  {
    title: "Add Gallery Image",
    href: "/admin/gallery",
    icon: Image,
  },
  {
    title: "Manage Categories",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    title: "View Dealers",
    href: "/admin/dealers",
    icon: Users,
  },
];

export default function DashboardPage() {
  const [counts, setCounts] = useState<Counts>({
    products: 0,
    categories: 0,
    dealers: 0,
    downloads: 0,
    gallery: 0,
    blogs: 0,
  });

  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminFetch("/api/dashboard/stats"),
      adminFetch("/api/dashboard/activity"),
    ])
      .then(async ([a, b]) => {
        const aj = await a.json();
        const bj = await b.json();

        if (a.ok) {
          setCounts(aj.counts);
        }

        if (b.ok) {
          setLogs(bj.logs || []);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const total = Object.values(counts).reduce(
    (sum, value) => sum + value,
    0
  );

  const cards: DashboardCard[] = [
    {
      title: "Products",
      value: counts.products,
      icon: Package,
      href: "/admin/products",
    },
    {
      title: "Categories",
      value: counts.categories,
      icon: FolderTree,
      href: "/admin/categories",
    },
    {
      title: "Dealers",
      value: counts.dealers,
      icon: Users,
      href: "/admin/dealers",
    },
    {
      title: "Downloads",
      value: counts.downloads,
      icon: Download,
      href: "/admin/downloads",
    },
    {
      title: "Gallery",
      value: counts.gallery,
      icon: Image,
      href: "/admin/gallery",
    },
    {
      title: "Blogs",
      value: counts.blogs,
      icon: FileText,
      href: "/admin/blogs",
    },
  ];

  return (
    <div className="space-y-7">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-[32px] border border-[#ddd2c5] bg-[#f7f1e9] p-8">
        <div className="relative grid gap-8 lg:grid-cols-[1fr_300px]">
          <div>
            <p className="mb-4 text-sm font-black uppercase tracking-[0.28em] text-[#a85f45]">
              Sizal HD Admin
            </p>

            <h1 className="max-w-3xl text-5xl font-black leading-[0.98] tracking-[-0.06em] text-[#2d2925] md:text-6xl">
              Manage.
              <br />
              Monitor.
              <br />
              <span className="bg-gradient-to-r from-[#9a5a41] to-[#d8ad67] bg-clip-text text-transparent">
                Grow with Precision.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#625950]">
              Control products, categories, dealers, downloads, gallery and
              blogs from one connected dashboard.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {quick.slice(0, 2).map((q) => (
                <Link
                  key={q.href}
                  href={q.href}
                  className="rounded-2xl bg-[#2d2925] px-6 py-4 text-sm font-black text-white transition hover:bg-[#443d37]"
                >
                  {q.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Total Records */}
          <div className="rounded-[28px] border border-white/70 bg-white/60 p-6">
            <div className="flex items-center justify-between">
              <p className="font-bold text-[#6b6259]">Total Records</p>

              <ShieldCheck
                size={22}
                className="text-[#a85f45]"
              />
            </div>

            <p className="mt-4 text-6xl font-black text-[#2d2925]">
              {loading ? "..." : total}
            </p>

            <p className="mt-2 text-sm font-semibold text-[#7b7066]">
              Live Neon PostgreSQL data
            </p>
          </div>
        </div>
      </section>

      {/* Dashboard Cards */}
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-6">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-[26px] border border-[#ddd2c5] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5a341d] to-[#b98543] text-white">
                  <Icon size={24} />
                </div>

                <ArrowRight size={18} />
              </div>

              <p className="text-sm font-bold text-[#7b7066]">
                {card.title}
              </p>

              <p className="mt-2 text-4xl font-black">
                {loading ? "..." : card.value}
              </p>
            </Link>
          );
        })}
      </section>

      {/* Recent Activity */}
      <section className="rounded-[28px] border bg-white p-6">
        <div className="mb-5 flex items-center gap-3">
          <Activity size={24} />

          <h2 className="text-2xl font-black">
            Recent Activity
          </h2>
        </div>

        {logs.length === 0 ? (
          <p className="text-slate-500">
            No activity yet.
          </p>
        ) : (
          <div className="space-y-3">
            {logs.slice(0, 8).map((log) => (
              <div
                key={log.id}
                className="rounded-2xl border p-4"
              >
                <p className="font-bold">
                  {log.message}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {log.createdAt
                    ? new Date(log.createdAt).toLocaleString("en-IN")
                    : ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}