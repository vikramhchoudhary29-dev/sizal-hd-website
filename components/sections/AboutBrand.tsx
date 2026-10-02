"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import { getWhatsAppUrl, normalizeWhatsAppNumber } from "@/lib/utilis/whatsapp";

const features = [
  "Premium HD Vision",
  "Blue Light Protection",
  "Photochromic Comfort",
  "Night Driving Solutions",
  "Progressive Freeform Designs",
  "UV Protection",
  "Scratch Resistant Coating",
  "Super Hydrophobic Surface",
];

type Settings = {
  companyPhone: string;
  whatsappNumber: string;
  whatsappUrl: string;
};

export default function AboutBrand() {
  const [settings, setSettings] = useState<Settings>({
    companyPhone: "",
    whatsappNumber: "",
    whatsappUrl: "",
  });

  useEffect(() => {
    fetch("/api/content/settings", {
      cache: "no-store",
    })
      .then((response) => response.json())
      .then((json) => {
        const data = json.data?.[0];

        if (data) {
          setSettings({
            companyPhone: data.companyPhone || "",
            whatsappNumber: data.whatsappNumber || "",
            whatsappUrl: data.whatsappUrl || "",
          });
        }
      })
      .catch(() => undefined);
  }, []);

  const whatsappNumber = normalizeWhatsAppNumber(settings.whatsappNumber);
  const whatsappDisplay = settings.whatsappNumber || whatsappNumber;
  const whatsappHref = getWhatsAppUrl(
    settings.whatsappNumber,
    settings.whatsappUrl
  );

  return (
    <section className="relative overflow-hidden bg-[#f7fbff] px-5 py-24 md:px-12 md:py-32 lg:px-16">
      <div className="absolute left-[-180px] top-24 h-[420px] w-[420px] rounded-full bg-cyan-200/50 blur-3xl" />
      <div className="absolute right-[-180px] bottom-24 h-[420px] w-[420px] rounded-full bg-blue-200/50 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-[#E31E24]">
            About Sizal HD
          </p>

          <h2 className="text-4xl font-black tracking-[-0.05em] text-slate-950 md:text-6xl">
            Excellence In Vision
          </h2>

          <p className="mx-auto mt-6 text-lg leading-8 text-slate-600">
            Premium spectacle lenses engineered with advanced optical
            technology to deliver clarity, comfort and trusted performance.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">
          <div className="rounded-[2rem] border border-white bg-white p-8 shadow-[0_30px_90px_rgba(15,23,42,0.08)] md:p-10">
            <h3 className="text-3xl font-black tracking-[-0.04em] text-slate-950">
              Welcome To Sizal HD Lenses
            </h3>

            <p className="mt-6 leading-8 text-slate-600">
              At Sizal HD Lenses, every detail is inspired by a single purpose
              — to deliver a vision experience that feels pure, precise and
              effortlessly clear. Our name stands as a symbol of high-definition
              clarity and refined optical excellence.
            </p>

            <p className="mt-5 leading-8 text-slate-600">
              Driven by innovation and precision engineering, Sizal HD combines
              advanced optical technology with premium manufacturing standards
              to create lenses that enhance contrast, reduce glare and improve
              everyday visual comfort.
            </p>

            <div className="mt-8 rounded-[1.5rem] border border-[#E31E24]/20 bg-[#E31E24]/5 p-6">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-[#E31E24]">
                Our Vision
              </p>

              <p className="text-lg font-bold leading-8 text-slate-800">
                To ensure every customer receives the most suitable lens for
                their eyes by delivering premium-quality ophthalmic lenses
                powered by the latest technology while becoming one of India's
                most trusted vision brands.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white bg-slate-950 p-8 text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)] md:p-10">
            <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
              <ShieldCheck size={28} />
            </div>

            <h3 className="text-3xl font-black tracking-[-0.04em]">
              Built For Optical Professionals
            </h3>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {features.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    size={19}
                    className="mt-1 shrink-0 text-cyan-300"
                  />

                  <span className="text-sm font-semibold leading-6 text-slate-300">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-6">
              <div className="flex items-center gap-3">
                <Sparkles className="text-cyan-300" size={22} />
                <p className="font-black">
                  Precision Beyond Vision
                </p>
              </div>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                Designed for professionals who value clarity, confidence and
                long-term customer trust.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-white bg-white p-7 shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
            <MessageCircle
              className="mb-5 text-green-600"
              size={30}
            />

            <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">
              WhatsApp Orders
            </p>

            <p className="mt-3 text-2xl font-black text-slate-950">
              {whatsappDisplay || "Contact number not configured"}
            </p>
          </div>

          <div className="rounded-[2rem] border border-white bg-white p-7 shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
            <Phone
              className="mb-5 text-cyan-600"
              size={30}
            />

            <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">
              Calling Only
            </p>

            <p className="mt-3 text-2xl font-black text-slate-950">
              {settings.companyPhone || "Contact number not configured"}
            </p>
          </div>

          <div className="rounded-[2rem] border border-white bg-white p-7 shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
            <MapPin
              className="mb-5 text-[#E31E24]"
              size={30}
            />

            <p className="text-sm font-black uppercase tracking-[0.2em] text-slate-500">
              Head Office
            </p>

            <p className="mt-3 text-2xl font-black text-[#E31E24]">
              SHRI OPTICAL
            </p>

            <p className="mt-3 leading-7 text-slate-700">
              381, Narottam Wadi, Near Nattu Bhai Chasmawale,
              Kalbadevi Road, Mumbai - 400002
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-[2rem] bg-slate-950 p-8 text-center text-white shadow-[0_30px_90px_rgba(15,23,42,0.2)] md:p-10">
          <h3 className="text-3xl font-black tracking-[-0.04em]">
            Join hundreds of optical dealers who trust Sizal HD.
          </h3>

          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Link
              href="/dealer"
              className="rounded-full bg-white px-8 py-4 font-black text-slate-950 transition hover:bg-cyan-300"
            >
              Become Dealer
            </Link>

            <a
              href={whatsappHref || "#"}
              target={whatsappHref ? "_blank" : undefined}
              rel={whatsappHref ? "noopener noreferrer" : undefined}
              aria-disabled={!whatsappHref}
              className={`rounded-full border border-white/15 px-8 py-4 font-black text-white transition hover:border-cyan-300 hover:text-cyan-300 ${!whatsappHref ? "cursor-not-allowed opacity-50" : ""}`}
            >
              WhatsApp Order
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}