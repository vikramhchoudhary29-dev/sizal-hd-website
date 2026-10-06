"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const demos = [
  {
    title: "Night Driving",
    subtitle: "Reduced glare for more comfortable night vision.",
    video: "/videos/night-driving.mp4",
    normal: ["High glare", "Low contrast", "Eye strain"],
    sizal: ["Reduced glare", "Better contrast", "Comfortable vision"],
  },
  {
    title: "Digital Screen",
    subtitle: "Designed for long screen hours and daily device usage.",
    video: "/videos/digital-screen.mp4",
    normal: ["Screen fatigue", "Harsh blue light", "Visual discomfort"],
    sizal: ["Blue block support", "Softer screen comfort", "Clearer focus"],
  },
  {
    title: "Outdoor Sunlight",
    subtitle: "Comfortable clarity for bright outdoor conditions.",
    video: "/videos/outdoor-sunlight.mp4",
    normal: ["Brightness discomfort", "Color imbalance", "Low comfort"],
    sizal: ["UV protection", "Balanced clarity", "Outdoor comfort"],
  },
  {
    title: "Polycarbonate",
    subtitle:
      "Experience the strength and impact resistance of polycarbonate lenses.",
    video: "/videos/polycarbonate.mp4",
    normal: ["Can crack on impact", "Lower durability", "Less impact resistance"],
    sizal: ["High impact resistant", "Lightweight & durable", "Ideal for kids & sports"],
  },
];

export default function Compare() {
  const [active, setActive] = useState(0);
  const selected = demos[active];

  return (
    <section
      id="compare"
      className="relative overflow-hidden bg-[#071226] px-5 py-24 text-white md:px-12 md:py-32 lg:px-16"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,198,255,0.16),transparent_32%),radial-gradient(circle_at_85%_75%,rgba(227,30,36,0.13),transparent_30%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
            Interactive Experience
          </p>

          <h2 className="text-4xl font-black tracking-[-0.05em] md:text-6xl">
            See the Difference
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Select a real-life situation and explore how Sizal HD lens
            technology improves everyday visual comfort.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.42fr_0.58fr]">
          <div className="space-y-4">
            {demos.map((item, index) => {
              const isActive = active === index;

              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`group w-full rounded-[1.6rem] border p-6 text-left transition duration-300 ${
                    isActive
                      ? "border-cyan-300/50 bg-white text-slate-950 shadow-[0_25px_70px_rgba(0,198,255,0.2)]"
                      : "border-white/10 bg-white/[0.055] text-white hover:border-cyan-300/30 hover:bg-white/[0.09]"
                  }`}
                >
                  <h3 className="text-xl font-black tracking-[-0.03em]">
                    {item.title}
                  </h3>

                  <p
                    className={`mt-2 text-sm leading-6 ${
                      isActive ? "text-slate-600" : "text-slate-300"
                    }`}
                  >
                    {item.subtitle}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="overflow-hidden rounded-[2.3rem] border border-white/10 bg-white/[0.055] p-4 shadow-[0_40px_120px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="relative overflow-hidden rounded-[1.8rem] bg-slate-950">
              <video
                key={selected.title}
                src={selected.video}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="aspect-video w-full object-contain"
              />
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
                <p className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-slate-400">
                  Normal Lens
                </p>

                <div className="space-y-3">
                  {selected.normal.map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/15 text-xs font-black text-red-300">
                        ×
                      </span>
                      <span className="text-sm font-semibold text-slate-300">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-cyan-300/20 bg-cyan-300/10 p-5">
                <p className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-cyan-300">
                  Sizal HD Lens
                </p>

                <div className="space-y-3">
                  {selected.sizal.map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle2
                        size={20}
                        className="shrink-0 text-cyan-300"
                      />
                      <span className="text-sm font-semibold text-white">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <a
              href="#products"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-1 hover:bg-cyan-300"
            >
              Explore Lens Range
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}