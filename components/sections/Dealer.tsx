import Link from "next/link";
import {
  CheckCircle2,
  PackageCheck,
  Truck,
  Megaphone,
  Smartphone,
} from "lucide-react";

const benefits = [
  {
    icon: PackageCheck,
    title: "Premium Lens Portfolio",
    desc: "Complete range of premium single vision and progressive lenses.",
  },
  {
    icon: Truck,
    title: "Fast Dispatch",
    desc: "Reliable and quick delivery to help you serve customers faster.",
  },
  {
    icon: Megaphone,
    title: "Marketing Support",
    desc: "Branding materials, product promotions and dealer assistance.",
  },
  {
    icon: Smartphone,
    title: "Smart Ordering",
    desc: "Place orders instantly using the official Sizal HD Dealer App.",
  },
];

export default function Dealer() {
  return (
    <section
      id="dealer"
      className="relative overflow-hidden bg-[#061019] px-5 py-24 text-white md:px-12 md:py-32 lg:px-16"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(0,198,255,0.15),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(227,30,36,0.12),transparent_28%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
            Dealer Program
          </p>

          <h2 className="text-4xl font-black tracking-[-0.05em] md:text-6xl">
            Grow With
            <br />
            Sizal HD
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            Join our growing dealer network and get premium products, fast
            dispatch, marketing support and powerful B2B ordering tools.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-[2rem] border border-white/10 bg-white/[0.05] p-8 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-cyan-400/30 hover:bg-white/[0.08]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                  <Icon size={28} />
                </div>

                <h3 className="mt-6 text-2xl font-black">
                  {item.title}
                </h3>

                <p className="mt-4 leading-7 text-slate-300">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-14 flex justify-center">
          <Link
            href="/dealer"
            className="inline-flex items-center gap-3 rounded-full bg-white px-10 py-5 text-lg font-black text-slate-950 transition duration-300 hover:-translate-y-1 hover:bg-cyan-300"
          >
            <CheckCircle2 size={22} />
            Become a Dealer
          </Link>
        </div>
      </div>
    </section>
  );
}