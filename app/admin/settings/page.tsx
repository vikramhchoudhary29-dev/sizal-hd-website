"use client";

import { useEffect, useState } from "react";
import { WebsiteSettings } from "@/types/settings";
import { adminFetch } from "@/lib/api/adminToken";

const defaults: WebsiteSettings = {
  heroTitle: "Precision Beyond",
  heroHighlight: "Vision",
  heroSubtitle:
    "Premium spectacle lenses engineered for HD clarity, blue light protection, photochromic comfort and superior everyday vision.",
  primaryButtonText: "Explore Products",
  primaryButtonUrl: "/products",
  secondaryButtonText: "Download Catalogue",
  secondaryButtonUrl: "/downloads",
  galleryHeroTitle: "Sizal HD Gallery",
  galleryHeroHighlight: "Precision in every frame.",
  galleryHeroSubtitle:
    "Explore product visuals, lens technology, events, people and the Sizal HD brand story.",

  companyPhone: "",
  whatsappNumber: "",
  companyEmail: "",
  companyAddress: "",

  instagramUrl: "",
  facebookUrl: "",
  whatsappUrl: "",

  seoTitle: "Sizal HD Lenses",
  seoDescription: "Premium spectacle lens technology.",
};

const inputClass =
  "min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

export default function SettingsPage() {
  const [settings, setSettings] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/content/settings", { cache: "no-store" })
      .then((response) => response.json())
      .then((json) => {
        if (json.data?.[0]) {
          setSettings({
            ...defaults,
            ...json.data[0],
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    try {
      const body = Object.fromEntries(
        new FormData(event.currentTarget).entries()
      );

      const response = await adminFetch(
        "/api/content/settings",
        {
          method: "POST",
          body: JSON.stringify(body),
        }
      );

      const json = await response.json();

      if (!response.ok) {
        throw new Error(
          json.error || "Failed to save settings"
        );
      }

      setSettings(
        (current) =>
          ({
            ...current,
            ...body,
          }) as WebsiteSettings
      );

      alert("Settings saved successfully");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to save settings"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <p className="font-semibold text-slate-500">
        Loading settings...
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-7">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[#9a5a41]">
          Configuration
        </p>

        <h1 className="mt-2 text-4xl font-black md:text-5xl">
          Website Settings
        </h1>

        <p className="mt-2 text-slate-500">
          Manage homepage content, contact details, gallery hero
          content and SEO without changing code.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-6">
        <section className="rounded-3xl border bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-black">
            Homepage Hero
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {(
              [
                "heroTitle",
                "heroHighlight",
                "primaryButtonText",
                "primaryButtonUrl",
                "secondaryButtonText",
                "secondaryButtonUrl",
              ] as const
            ).map((key) => (
              <input
                key={key}
                name={key}
                defaultValue={settings[key]}
                placeholder={key}
                className={inputClass}
              />
            ))}
          </div>

          <textarea
            name="heroSubtitle"
            defaultValue={settings.heroSubtitle}
            rows={4}
            className={`${inputClass} mt-4 py-3`}
            placeholder="Hero subtitle"
          />
        </section>

        <section className="rounded-3xl border bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-black">
            Gallery Hero
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            This controls the dedicated public gallery hero.
          </p>

          <div className="mt-5 grid gap-4">
            <input
              name="galleryHeroTitle"
              defaultValue={settings.galleryHeroTitle}
              className={inputClass}
              placeholder="Gallery title"
            />

            <input
              name="galleryHeroHighlight"
              defaultValue={settings.galleryHeroHighlight}
              className={inputClass}
              placeholder="Gallery highlight"
            />

            <textarea
              name="galleryHeroSubtitle"
              defaultValue={settings.galleryHeroSubtitle}
              rows={4}
              className={`${inputClass} py-3`}
              placeholder="Gallery subtitle"
            />
          </div>
        </section>

        <section className="rounded-3xl border bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-black">
            Company Contact
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-600">
                Calling Phone Number
              </label>

              <input
                name="companyPhone"
                defaultValue={settings.companyPhone}
                className={inputClass}
                placeholder="Calling phone number"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-600">
                Email
              </label>

              <input
                name="companyEmail"
                defaultValue={settings.companyEmail}
                className={inputClass}
                placeholder="Email"
              />
            </div>
          </div>

          <textarea
            name="companyAddress"
            defaultValue={settings.companyAddress}
            rows={4}
            className={`${inputClass} mt-4 py-3`}
            placeholder="Address"
          />

          <p className="mt-3 rounded-xl bg-blue-50 p-3 text-sm font-semibold leading-6 text-blue-800">
            The calling phone number is used for the public phone
            contact. WhatsApp now has its own separate number and
            link fields.
          </p>
        </section>

        <section className="rounded-3xl border bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-black">
            WhatsApp & Social
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-600">
                WhatsApp Number
              </label>

              <input
                name="whatsappNumber"
                defaultValue={settings.whatsappNumber}
                className={inputClass}
                placeholder="WhatsApp number e.g. 7218192616"
              />

              <p className="mt-2 text-xs text-slate-500">
                This number is displayed on the homepage under
                WhatsApp Orders.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-600">
                WhatsApp Link
              </label>

              <input
                name="whatsappUrl"
                defaultValue={settings.whatsappUrl}
                className={inputClass}
                placeholder="https://wa.me/917218192616"
              />

              <p className="mt-2 text-xs text-slate-500">
                This link is used by WhatsApp Us, WhatsApp Order
                and Send Enquiry buttons.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-600">
                Instagram URL
              </label>

              <input
                name="instagramUrl"
                defaultValue={settings.instagramUrl}
                className={inputClass}
                placeholder="Instagram URL"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-600">
                Facebook URL
              </label>

              <input
                name="facebookUrl"
                defaultValue={settings.facebookUrl}
                className={inputClass}
                placeholder="Facebook URL"
              />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-2xl font-black">
            SEO
          </h2>

          <div className="mt-5 grid gap-4">
            <input
              name="seoTitle"
              defaultValue={settings.seoTitle}
              className={inputClass}
              placeholder="SEO title"
            />

            <textarea
              name="seoDescription"
              defaultValue={settings.seoDescription}
              rows={4}
              className={`${inputClass} py-3`}
              placeholder="SEO description"
            />
          </div>
        </section>

        <button
          disabled={saving}
          className="min-h-12 rounded-xl bg-blue-600 px-8 py-3 font-black text-white shadow-lg shadow-blue-500/20 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}