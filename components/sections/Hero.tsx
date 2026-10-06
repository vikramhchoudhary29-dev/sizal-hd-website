"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

type HeroSettings = {
  heroTitle?: string;
  heroHighlight?: string;
  heroSubtitle?: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
};

const fallback: HeroSettings = {
  heroTitle: "Precision Beyond",
  heroHighlight: "VISION",
  heroSubtitle:
    "Premium spectacle lenses engineered for HD clarity, blue light protection, photochromic comfort and superior everyday vision.",
  primaryButtonText: "Explore Products",
  primaryButtonUrl: "/products",
  secondaryButtonText: "Download Catalogue",
  secondaryButtonUrl: "/downloads",
};

export default function Hero() {
  const [settings, setSettings] = useState<HeroSettings>(fallback);

  useEffect(() => {
    async function loadSettings() {
      const response = await fetch("/api/content/settings", { cache: "no-store" });
      if (!response.ok) return;
      const json = await response.json();
      const data = json.data?.[0];
      if (data) setSettings({ ...fallback, ...data });
    }

    loadSettings();
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#f8fbff] px-5 pb-20 pt-36 md:px-12 lg:px-16">
      <div className="absolute inset-0 animate-[softGlow_7s_ease-in-out_infinite] bg-[radial-gradient(circle_at_50%_0%,rgba(0,107,255,0.12),transparent_34%),radial-gradient(circle_at_80%_55%,rgba(0,200,255,0.12),transparent_30%),linear-gradient(180deg,#ffffff_0%,#f8fbff_48%,#eef7ff_100%)]" />

      <div className="absolute left-1/2 top-24 h-[520px] w-[520px] -translate-x-1/2 animate-[floatGlow_6s_ease-in-out_infinite] rounded-full bg-blue-400/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex animate-[fadeUp_0.7s_ease-out_both] items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-5 py-2.5 text-xs font-black tracking-[0.22em] text-blue-700 shadow-sm backdrop-blur">
            <Sparkles size={15} />
            NEXT GENERATION LENS TECHNOLOGY
          </div>

          <h1 className="mx-auto max-w-5xl animate-[fadeUp_0.9s_ease-out_both] text-5xl font-black leading-[0.92] tracking-[-0.065em] text-slate-950 md:text-7xl lg:text-[6.4rem]">
            {settings.heroTitle}
            <br />
            <span className="bg-gradient-to-r from-[#111111] via-[#006DFF] to-[#E31E24] bg-clip-text text-transparent">
              {settings.heroHighlight}
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl animate-[fadeUp_1.1s_ease-out_both] text-base leading-8 text-slate-600 md:text-lg">
            {settings.heroSubtitle}
          </p>

          <div className="mt-9 flex animate-[fadeUp_1.3s_ease-out_both] flex-wrap justify-center gap-4">
            <Link
              href={settings.primaryButtonUrl || "/products"}
              className="group inline-flex items-center gap-2 rounded-full bg-slate-950 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-slate-900/20 transition hover:-translate-y-1 hover:bg-[#E31E24]"
            >
              {settings.primaryButtonText}
              <ArrowRight
                size={17}
                className="transition group-hover:translate-x-1"
              />
            </Link>

            <Link
              href={settings.secondaryButtonUrl || "/downloads"}
              className="rounded-full border border-slate-200 bg-white px-7 py-4 text-sm font-bold text-slate-950 shadow-xl shadow-slate-900/5 transition hover:-translate-y-1 hover:border-blue-200 hover:text-blue-700"
            >
              {settings.secondaryButtonText}
            </Link>
          </div>
        </div>

        <div className="relative mx-auto mt-16 max-w-6xl animate-[fadeUp_1.45s_ease-out_both]">
          <div className="absolute -inset-8 animate-[softGlow_6s_ease-in-out_infinite] rounded-[3rem] bg-gradient-to-r from-blue-500/15 via-cyan-400/15 to-red-500/10 blur-3xl" />

          <div className="relative overflow-hidden rounded-[2.4rem] border border-white bg-white/75 p-4 shadow-[0_40px_120px_rgba(15,23,42,0.14)] backdrop-blur-2xl">
            <div className="overflow-hidden rounded-[1.8rem] bg-slate-950">
              <video
                src="/videos/hero-video.mp4"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="aspect-video w-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}