"use client";

import { useState } from "react";
import { ArrowRight, Building2, CheckCircle2, MapPin, Phone, UserRound } from "lucide-react";
import WebsiteNavbar from "@/components/website/WebsiteNavbar";
import Footer from "@/components/layout/Footer";

const inputClass =
  "min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50";

export default function DealerPage() {
  const [saving, setSaving] = useState(false);
  const [showBusinessDetails, setShowBusinessDetails] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    setSaving(true);

    try {
      const response = await fetch("/api/dealer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dealerName: form.get("dealerName"),
          shopName: form.get("shopName"),
          ownerName: form.get("ownerName"),
          mobile: form.get("mobile"),
          whatsapp: form.get("whatsapp"),
          email: form.get("email"),
          gstNumber: form.get("gstNumber"),
          address: form.get("address"),
          city: form.get("city"),
          state: form.get("state"),
          pincode: form.get("pincode"),
          dealerType: form.get("dealerType"),
          existingBrands: form.get("existingBrands"),
          monthlyPurchase: form.get("monthlyPurchase"),
          interestedProducts: form.get("interestedProducts"),
          salesRepresentative: "",
          status: "new",
          notes: "Submitted from website dealer registration form",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit registration.");
      }

      alert("Dealer registration submitted successfully. Our team will contact you soon.");
      formElement.reset();
      setShowBusinessDetails(false);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed to submit registration.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <WebsiteNavbar />

      <main className="min-h-screen bg-[#F8FBFF] px-5 pb-20 pt-32 sm:px-6 md:px-10 md:pt-40 lg:px-20">
        <div className="mx-auto max-w-5xl">
          <section className="mb-10 text-center md:mb-14">
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.3em] text-blue-600 sm:text-xs">
              SIZAL HD DEALER PROGRAM
            </p>
            <h1 className="text-4xl font-black tracking-[-0.05em] sm:text-5xl md:text-7xl">
              Become a Sizal HD Dealer
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Share your basic business details. Our team will contact you about products,
              dealership opportunities and ordering support.
            </p>
          </section>

          <form
            onSubmit={handleSubmit}
            className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_25px_90px_rgba(15,23,42,0.07)]"
          >
            <div className="border-b border-slate-100 bg-slate-50/70 p-5 sm:p-7">
              <div className="grid gap-4 md:grid-cols-3">
                <Step icon={UserRound} title="Your details" text="Name & contact" />
                <Step icon={Building2} title="Business" text="Shop information" />
                <Step icon={MapPin} title="Location" text="City & address" />
              </div>
            </div>

            <div className="space-y-7 p-5 sm:p-7 md:p-9">
              <section>
                <SectionTitle title="Contact details" />
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <Field name="dealerName" label="Dealer / Contact Name" placeholder="Your name" required />
                  <Field name="ownerName" label="Owner Name" placeholder="Owner name" />
                  <Field name="mobile" label="Mobile Number" placeholder="10-digit mobile number" type="tel" required />
                  <Field name="whatsapp" label="WhatsApp Number" placeholder="WhatsApp number (optional)" type="tel" />
                  <Field name="email" label="Email" placeholder="Business email (optional)" type="email" />
                </div>
              </section>

              <section>
                <SectionTitle title="Business details" />
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <Field name="shopName" label="Shop Name" placeholder="Optical shop / business name" required />
                  <Field name="dealerType" label="Dealer Type" placeholder="Retailer / wholesaler / distributor" />
                  <Field name="city" label="City" placeholder="City" />
                  <Field name="state" label="State" placeholder="State" />
                </div>

                <button
                  type="button"
                  onClick={() => setShowBusinessDetails((value) => !value)}
                  className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
                >
                  {showBusinessDetails ? "Hide" : "Add"} business details
                  <ArrowRight size={16} className={showBusinessDetails ? "rotate-90" : ""} />
                </button>

                {showBusinessDetails && (
                  <div className="mt-4 grid gap-4 rounded-2xl bg-slate-50 p-4 md:grid-cols-2">
                    <Field name="gstNumber" label="GST Number" placeholder="GST number (optional)" />
                    <Field name="pincode" label="Pincode" placeholder="Pincode" />
                    <Field name="monthlyPurchase" label="Monthly Purchase" placeholder="Approximate monthly purchase" />
                    <Field name="existingBrands" label="Existing Lens Brands" placeholder="Brands you currently stock" />
                    <Field name="interestedProducts" label="Interested Products" placeholder="Products you're interested in" />
                  </div>
                )}
              </section>

              <section>
                <SectionTitle title="Address" />
                <div className="mt-4">
                  <textarea
                    name="address"
                    rows={4}
                    className={`${inputClass} py-3`}
                    placeholder="Full shop / business address"
                  />
                </div>
              </section>

              <div className="flex flex-col gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm leading-6 text-slate-500">
                  Your information is submitted securely for dealer follow-up.
                </p>
                <button
                  disabled={saving}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 font-black text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60"
                >
                  <Phone size={18} />
                  {saving ? "Submitting..." : "Submit Dealer Request"}
                </button>
              </div>
            </div>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-slate-500">
            <CheckCircle2 size={17} className="text-emerald-500" />
            Our team can contact you using the mobile / WhatsApp number you provide.
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

function Field({
  name,
  label,
  placeholder,
  type = "text",
  required = false,
}: {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-extrabold text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className={inputClass}
      />
    </label>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h2 className="text-lg font-black text-slate-950 sm:text-xl">{title}</h2>;
}

function Step({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof UserRound;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon size={19} />
      </div>
      <div>
        <p className="text-sm font-black text-slate-900">{title}</p>
        <p className="text-xs font-semibold text-slate-500">{text}</p>
      </div>
    </div>
  );
}
