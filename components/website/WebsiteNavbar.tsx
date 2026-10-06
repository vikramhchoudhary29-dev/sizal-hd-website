"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Gallery", href: "/gallery" },
  { label: "Downloads", href: "/downloads" },
  { label: "Blogs", href: "/blogs" },
  { label: "Dealer", href: "/dealer" },
  { label: "App", href: "/#app" },
  { label: "Contact", href: "/contact" },
];

export default function WebsiteNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="relative z-50 mx-auto mt-6 w-[calc(100%-32px)] max-w-7xl rounded-3xl border border-white/70 bg-white/85 px-5 py-4 shadow-xl shadow-blue-500/10 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Image src="/images/logo.png" alt="Sizal HD" width={220} height={80} className="h-auto w-[150px] md:w-[190px]" priority />
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-bold text-slate-600 lg:flex">
            {navItems.map((item) => <Link key={item.label} href={item.href} className="transition hover:text-blue-600">{item.label}</Link>)}
          </nav>

          <Link href="/dealer" className="hidden rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-700 lg:block">Become Dealer</Link>

          <button onClick={() => setOpen(!open)} className="rounded-xl p-2 text-slate-800 lg:hidden" aria-label="Toggle navigation">
            {open ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      <div className={`fixed left-0 top-0 z-40 h-screen w-full bg-white transition-all duration-300 lg:hidden ${open ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="flex items-center justify-between border-b px-6 py-5">
          <Image src="/images/logo.png" alt="Sizal HD" width={180} height={60} />
          <button onClick={() => setOpen(false)} aria-label="Close navigation"><X size={30} /></button>
        </div>
        <nav className="flex flex-col px-8 py-8">
          {navItems.map((item) => <Link key={item.label} href={item.href} onClick={() => setOpen(false)} className="border-b py-5 text-xl font-semibold text-slate-700">{item.label}</Link>)}
          <Link href="/dealer" onClick={() => setOpen(false)} className="mt-8 rounded-full bg-blue-600 py-4 text-center text-lg font-bold text-white">Become Dealer</Link>
        </nav>
      </div>
    </>
  );
}
