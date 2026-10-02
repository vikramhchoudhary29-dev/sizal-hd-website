import {
  Droplets,
  Eye,
  Glasses,
  MonitorSmartphone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const technologies = [
  {
    title: "Blue Block",
    description: "Helps reduce digital eye strain caused by screens and artificial light.",
    icon: MonitorSmartphone,
  },
  {
    title: "HD Clarity",
    description: "Engineered for sharper, cleaner and more comfortable everyday vision.",
    icon: Eye,
  },
  {
    title: "UV Protection",
    description: "Protects eyes from harmful ultraviolet rays during outdoor use.",
    icon: ShieldCheck,
  },
  {
    title: "Hydrophobic Coating",
    description: "Repels water and keeps lenses cleaner during daily wear.",
    icon: Droplets,
  },
  {
    title: "Scratch Resistant",
    description: "Durable coating support for longer lens life and better protection.",
    icon: Sparkles,
  },
  {
    title: "Premium Lens Comfort",
    description: "Designed for spectacles, digital lifestyle and all-day comfort.",
    icon: Glasses,
  },
];

export default function Technologies() {
  return (
    <section
      id="technology"
      className="relative overflow-hidden bg-white px-5 py-24 md:px-12 md:py-32 lg:px-16"
    >
      <div className="absolute left-1/2 top-28 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-blue-100/70 blur-3xl" />
      <div className="absolute right-[-180px] bottom-0 h-[360px] w-[360px] rounded-full bg-red-100/50 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-[#E31E24]">
            Why Choose Sizal HD
          </p>

          <h2 className="text-4xl font-black tracking-[-0.05em] text-slate-950 md:text-6xl">
            Advanced Lens Technology.
            <br />
            Superior Vision.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
            Designed for modern optical needs with premium coatings, visual
            comfort and everyday durability.
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {technologies.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-[0_30px_90px_rgba(0,109,255,0.14)]"
              >
                <div className="absolute right-[-60px] top-[-60px] h-40 w-40 rounded-full bg-blue-50 opacity-0 transition duration-300 group-hover:opacity-100" />

                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/15 transition duration-300 group-hover:scale-110 group-hover:bg-[#E31E24]">
                  <Icon size={26} strokeWidth={2.4} />
                </div>

                <h3 className="relative mt-7 text-2xl font-black tracking-[-0.04em] text-slate-950">
                  {item.title}
                </h3>

                <p className="relative mt-4 text-sm leading-7 text-slate-600 md:text-base">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}