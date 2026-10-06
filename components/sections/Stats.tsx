"use client";

import CountUp from "react-countup";
import { Gem, ShieldCheck, Smile, UsersRound } from "lucide-react";

const stats = [
  {
    number: 5000,
    suffix: "+",
    label: "Happy Customers",
    icon: Gem,
  },
  {
    number: 100,
    suffix: "+",
    label: "Trusted Dealers",
    icon: UsersRound,
  },
  {
    number: 2,
    suffix: "M+",
    label: "Lenses Manufactured",
    icon: ShieldCheck,
  },
  {
    number: 98,
    suffix: "%",
    label: "Customer Satisfaction",
    icon: Smile,
  },
];

export default function Stats() {
  return (
    <section className="relative bg-[#061019] px-5 pb-24 md:px-12 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-white/80 bg-white px-6 py-8 text-slate-950 shadow-[0_30px_90px_rgba(0,0,0,0.25)] md:px-10">
          <div className="grid gap-8 md:grid-cols-4">
            {stats.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className={`flex items-center gap-4 ${
                    index !== 0
                      ? "md:border-l md:border-slate-200 md:pl-8"
                      : ""
                  }`}
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-teal-600">
                    <Icon size={28} strokeWidth={2.2} />
                  </div>

                  <div>
                    <p className="text-3xl font-black tracking-[-0.05em] text-teal-600">
                      <CountUp
                        end={item.number}
                        duration={2.5}
                        separator=","
                        enableScrollSpy
                        scrollSpyOnce
                      />
                      {item.suffix}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-600">
                      {item.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}