"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Droplets,
  Eye,
  MonitorSmartphone,
  ShieldCheck,
  Sparkles,
  Sun,
} from "lucide-react";

const layers = [
  {
    title: "UV Protection",
    short: "UV",
    icon: Sun,
    position: "left-[50%] top-0 -translate-x-1/2",
    glow: "from-orange-400 via-yellow-300 to-transparent",
    accent: "text-yellow-300",
    description:
      "Helps protect eyes from harmful UV rays while keeping everyday vision clear and comfortable.",
    benefits: ["UV defense", "Outdoor comfort", "Clear visibility"],
  },
  {
    title: "Hydrophobic Layer",
    short: "Water",
    icon: Droplets,
    position: "right-0 top-[25%] -translate-y-1/2",
    glow: "from-cyan-400 via-blue-400 to-transparent",
    accent: "text-cyan-300",
    description:
      "A water-repellent surface that helps reduce water spots, smudges and cleaning effort.",
    benefits: ["Water repellent", "Easy cleaning", "Cleaner lens surface"],
  },
  {
    title: "Low Reflection Coating",
    short: "LRC",
    icon: Eye,
    position: "right-0 bottom-[25%] translate-y-1/2",
    glow: "from-violet-500 via-cyan-300 to-transparent",
    accent: "text-violet-300",
    description:
      "Helps reduce surface reflection for clearer vision and a more premium lens appearance.",
    benefits: ["Reduced reflection", "Better clarity", "Premium look"],
  },
  {
    title: "Optical Lens Material",
    short: "Material",
    icon: Sparkles,
    position: "left-[50%] bottom-0 -translate-x-1/2",
    glow: "from-emerald-400 via-cyan-300 to-transparent",
    accent: "text-emerald-300",
    description:
      "The foundation of the lens, designed for optical stability, comfort and reliable performance.",
    benefits: ["Optical clarity", "Stable vision", "Daily comfort"],
  },
  {
    title: "Blue Block Technology",
    short: "Blue",
    icon: MonitorSmartphone,
    position: "left-0 bottom-[25%] translate-y-1/2",
    glow: "from-blue-500 via-cyan-300 to-transparent",
    accent: "text-blue-300",
    description:
      "Supports comfortable digital viewing for people who spend long hours around screens.",
    benefits: ["Screen comfort", "Blue light support", "Less visual fatigue"],
  },
  {
    title: "Hard Coat Layer",
    short: "Hard",
    icon: ShieldCheck,
    position: "left-0 top-[25%] -translate-y-1/2",
    glow: "from-slate-400 via-cyan-300 to-transparent",
    accent: "text-slate-200",
    description:
      "Adds surface durability support for better resistance against everyday wear and tear.",
    benefits: ["Durable surface", "Scratch resistance", "Longer lens life"],
  },
];

export default function ProductLayerExplorer() {
  const [active, setActive] = useState(4);
  const selected = layers[active];
  const SelectedIcon = selected.icon;

  return (
    <section className="relative overflow-hidden bg-[#061019] px-5 py-24 text-white md:px-12 md:py-32 lg:px-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(0,198,255,0.18),transparent_34%),radial-gradient(circle_at_80%_76%,rgba(227,30,36,0.13),transparent_30%)]" />

      <div
        className={`absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br ${selected.glow} opacity-20 blur-3xl transition duration-700`}
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
            Lens Technology
          </p>

          <h2 className="text-4xl font-black tracking-[-0.05em] md:text-6xl">
            Inside Every Sizal HD Lens
          </h2>

          <p className="mx-auto mt-6 text-lg leading-8 text-slate-300">
            Every layer works together to deliver clearer vision, lasting
            protection and all-day visual comfort.
          </p>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative mx-auto h-[560px] w-full max-w-[680px]">
            <div className="absolute left-1/2 top-1/2 h-[430px] w-[430px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
            <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border border-dashed border-cyan-300/15 [animation-duration:28s]" />

            <div className="absolute left-1/2 top-1/2 h-[2px] w-[430px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent" />
            <div className="absolute left-1/2 top-1/2 h-[430px] w-[2px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-b from-transparent via-cyan-300/20 to-transparent" />
            <div className="absolute left-1/2 top-1/2 h-[2px] w-[430px] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-gradient-to-r from-transparent via-cyan-300/15 to-transparent" />
            <div className="absolute left-1/2 top-1/2 h-[2px] w-[430px] -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-gradient-to-r from-transparent via-cyan-300/15 to-transparent" />

            <div className="absolute left-1/2 top-1/2 z-10 flex h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 animate-[lensFloat_5s_ease-in-out_infinite] items-center justify-center rounded-full border border-white/30 bg-gradient-to-br from-white/70 via-cyan-300/20 to-blue-500/20 shadow-[inset_0_0_60px_rgba(255,255,255,0.45),0_45px_110px_rgba(0,198,255,0.25)] backdrop-blur-xl">
              <div className="absolute inset-9 rounded-full border border-white/40" />
              <div className="absolute left-24 top-[-30px] h-[370px] w-20 rotate-[28deg] bg-white/60 blur-xl" />
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-br ${selected.glow} opacity-25 transition duration-700`}
              />

              <div className="relative z-10 text-center">
                <SelectedIcon
                  size={42}
                  className={`mx-auto mb-3 ${selected.accent}`}
                />
                <p className="text-xs font-black uppercase tracking-[0.25em] text-white/70">
                  Active Layer
                </p>
                <p className="mt-2 text-lg font-black">{selected.short}</p>
              </div>
            </div>

            {layers.map((item, index) => {
              const Icon = item.icon;
              const isActive = active === index;

              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`absolute z-20 ${item.position} group rounded-[1.4rem] border p-4 text-left backdrop-blur-xl transition duration-300 ${
                    isActive
                      ? "scale-105 border-cyan-300/60 bg-white text-slate-950 shadow-[0_25px_70px_rgba(0,198,255,0.22)]"
                      : "border-white/10 bg-white/[0.07] text-white hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/[0.12]"
                  }`}
                >
                  <div className="flex min-w-[180px] items-center gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                        isActive
                          ? "bg-cyan-100 text-cyan-700"
                          : "bg-white/10 text-cyan-300"
                      }`}
                    >
                      <Icon size={22} />
                    </div>

                    <div>
                      <p className="text-sm font-black leading-tight">
                        {item.title}
                      </p>
                      <p
                        className={`mt-1 text-xs font-semibold ${
                          isActive ? "text-slate-600" : "text-slate-400"
                        }`}
                      >
                        Click to explore
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-white/[0.06] px-5 py-2 text-sm font-bold text-slate-300 backdrop-blur-xl">
              Click any technology layer
            </div>
          </div>

          <div className="rounded-[2.2rem] border border-white/10 bg-white/[0.06] p-8 shadow-[0_35px_100px_rgba(0,0,0,0.25)] backdrop-blur-xl md:p-10">
            <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-950">
              <SelectedIcon size={32} />
            </div>

            <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
              Selected Technology
            </p>

            <h3 className="text-4xl font-black tracking-[-0.05em]">
              {selected.title}
            </h3>

            <p className="mt-5 text-lg leading-8 text-slate-300">
              {selected.description}
            </p>

            <div className="mt-8 grid gap-4">
              {selected.benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <CheckCircle2 size={20} className="text-cyan-300" />
                  <span className="font-bold text-white">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-5">
              <p className="text-sm font-bold leading-7 text-slate-200">
                Together, these layers help Sizal HD lenses deliver a premium
                experience built for modern optical needs.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes lensFloat {
          0%,
          100% {
            transform: translate(-50%, -50%) translateY(0px) rotate(-4deg);
          }
          50% {
            transform: translate(-50%, -50%) translateY(-18px) rotate(4deg);
          }
        }
      `}</style>
    </section>
  );
}