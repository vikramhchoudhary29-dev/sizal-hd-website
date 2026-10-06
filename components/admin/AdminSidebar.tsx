"use client";

import Image from "next/image";
import { ShieldCheck, LayoutDashboard, Package, FolderTree, Image as ImageIcon, Activity, Download, Users, FileText, Settings, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: FolderTree, label: "Categories", href: "/admin/categories" },
  { icon: ImageIcon, label: "Gallery", href: "/admin/gallery" },
  { icon: Download, label: "Downloads", href: "/admin/downloads" },
  { icon: Users, label: "Dealers", href: "/admin/dealers" },
  { icon: FileText, label: "Blogs", href: "/admin/blogs" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
  { icon: ShieldCheck, label: "Admins", href: "/admin/admins" },
  { icon: Activity, label: "Activity Logs", href: "/admin/activity" },
];

export default function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  return (
    <>
      {open && <button aria-label="Close admin navigation" className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[285px] shrink-0 flex-col border-r border-[#d4c8b9] bg-[#f4efe7] text-[#2d2a26] shadow-2xl transition-transform duration-300 lg:sticky lg:top-0 lg:z-30 lg:h-screen lg:translate-x-0 lg:shadow-none ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-[#e6ddd3] px-5 py-6 lg:block lg:px-6 lg:py-8">
          <div className="flex flex-col items-center">
            <Image src="/images/logo.png" alt="Sizal HD Lenses" width={250} height={95} priority className="h-auto w-full max-w-[220px] select-none object-contain" />
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#8b7a6b]">Admin Panel</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-700 lg:hidden" aria-label="Close admin navigation"><X size={24} /></button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5 lg:px-6">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return <Link key={item.label} href={item.href} onClick={onClose} className={`flex min-h-12 items-center gap-4 rounded-2xl px-4 py-3 text-[15px] font-semibold transition ${active ? "bg-gradient-to-r from-[#a85f45] to-[#e2b86f] text-white shadow-[0_18px_45px_rgba(168,95,69,0.35)]" : "text-[#3b3835] hover:bg-white/70"}`}><Icon size={20} />{item.label}</Link>;
          })}
        </nav>
      </aside>
    </>
  );
}
