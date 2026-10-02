"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { useEffect, useState } from "react";

type Settings = { companyPhone: string; companyEmail: string; companyAddress: string; whatsappUrl: string };

export default function Footer() {
  const [settings, setSettings] = useState<Settings>({ companyPhone: "", companyEmail: "", companyAddress: "", whatsappUrl: "" });

  useEffect(() => {
    fetch("/api/content/settings", { cache: "no-store" })
      .then((response) => response.json())
      .then((json) => {
        if (json.data?.[0]) setSettings((current) => ({ ...current, ...json.data[0] }));
      })
      .catch(() => undefined);
  }, []);

  return (
    <footer className="bg-[#061019] pt-16 pb-8 text-white sm:pt-20 md:pt-24" id="contact">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 md:px-10">
        <div className="grid gap-10 sm:gap-12 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr] lg:gap-14">
          <div>
            <div className="mb-7 inline-flex max-w-full rounded-[24px] border border-white/10 bg-white px-5 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:px-7 sm:py-5">
              <Image src="/images/logo.png" alt="Sizal HD Lenses" width={300} height={100} className="h-auto w-52 object-contain sm:w-64" priority />
            </div>
            <p className="max-w-md text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">Premium spectacle lenses engineered with advanced technology for crystal clear vision, maximum protection and superior visual comfort.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="https://play.google.com/store/apps/details?id=com.techcherry.SIZAL_HDLENSES" target="_blank" rel="noopener noreferrer" className="rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400">Download App</a>
              <Link href="/dealer" className="rounded-full border border-white/15 px-5 py-3 text-sm font-bold transition hover:border-cyan-400 hover:text-cyan-300">Become Dealer</Link>
            </div>
          </div>

          <div><h3 className="mb-5 text-lg font-black sm:text-xl">Company</h3><div className="space-y-3 text-sm text-slate-400 sm:space-y-4 sm:text-base"><Link className="block hover:text-cyan-300" href="/">Home</Link><Link className="block hover:text-cyan-300" href="/products">Products</Link><Link className="block hover:text-cyan-300" href="/gallery">Gallery</Link><Link className="block hover:text-cyan-300" href="/dealer">Dealer Program</Link><a className="block hover:text-cyan-300" href="/#app">Mobile App</a></div></div>
          <div><h3 className="mb-5 text-lg font-black sm:text-xl">Support</h3><div className="space-y-3 text-sm text-slate-400 sm:space-y-4 sm:text-base"><Link className="block hover:text-cyan-300" href="/downloads">Download Catalogue</Link><Link className="block hover:text-cyan-300" href="/contact">Contact Us</Link></div></div>
          <div><h3 className="mb-5 text-lg font-black sm:text-xl">Contact</h3><div className="space-y-5 text-sm text-slate-400 sm:text-base"><div className="flex items-start gap-3"><Phone size={18} className="mt-1 shrink-0 text-cyan-400" /><span className="break-words">{settings.companyPhone || "-"}</span></div><div className="flex items-start gap-3"><Mail size={18} className="mt-1 shrink-0 text-cyan-400" /><span className="break-words">{settings.companyEmail || "-"}</span></div><div className="flex items-start gap-3"><MapPin size={18} className="mt-1 shrink-0 text-cyan-400" /><span className="leading-7">{settings.companyAddress || "-"}</span></div></div></div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-7 sm:mt-16 sm:pt-8"><div className="flex flex-col gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left"><div><p className="text-xs text-slate-500 sm:text-sm">© 2026 <span className="font-semibold text-white">Sizal HD Lenses</span>. All Rights Reserved.</p><p className="mt-2 text-xs text-slate-500 sm:text-sm">Designed & Developed by <a href="https://arvikdigital.in" target="_blank" rel="noopener noreferrer" className="font-semibold text-cyan-400 hover:text-white hover:underline">Arvik Digital</a></p></div><p className="font-semibold text-cyan-400">Precision Beyond Vision</p></div></div>
      </div>
    </footer>
  );
}
