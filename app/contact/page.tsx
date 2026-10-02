"use client";

import { useEffect, useState } from "react";
import WebsiteNavbar from "@/components/website/WebsiteNavbar";
import Footer from "@/components/layout/Footer";
import {
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";

type Settings = {
  companyPhone?: string;
  whatsappNumber?: string;
  companyEmail?: string;
  companyAddress?: string;
  whatsappUrl?: string;
};

function whatsappLink(settings: Settings) {
  if (settings.whatsappUrl?.trim()) {
    return settings.whatsappUrl.trim();
  }

  const number = (settings.whatsappNumber || "").replace(
    /\D/g,
    ""
  );

  return number ? `https://wa.me/91${number}` : "";
}

export default function ContactPage() {
  const [settings, setSettings] = useState<Settings>({});
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch("/api/content/settings", {
      cache: "no-store",
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.data?.[0]) {
          setSettings(json.data[0]);
        }
      })
      .catch(() => undefined);
  }, []);

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const name = String(form.get("name") || "").trim();
    const mobile = String(form.get("mobile") || "").trim();
    const email = String(form.get("email") || "").trim();
    const message = String(form.get("message") || "").trim();

    const destination = whatsappLink(settings);

    if (!name || !mobile || !message) {
      alert(
        "Please enter your name, mobile number and message."
      );
      return;
    }

    if (!destination) {
      alert(
        "WhatsApp enquiry number is not configured yet. Please ask the administrator to add it in Settings."
      );
      return;
    }

    setSending(true);

    const text = [
      "Sizal HD Website Enquiry",
      "",
      `Name: ${name}`,
      `Mobile: ${mobile}`,
      email ? `Email: ${email}` : "",
      "",
      `Message: ${message}`,
    ]
      .filter(Boolean)
      .join("\n");

    window.open(
      `${destination}${
        destination.includes("?") ? "&" : "?"
      }text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );

    event.currentTarget.reset();
    setSending(false);
  }

  const destination = whatsappLink(settings);

  return (
    <>
      <WebsiteNavbar />

      <main className="min-h-screen bg-[#F8FBFF] px-5 pb-20 pt-32 sm:px-6 md:px-10 md:pt-40 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center md:mb-16">
            <p className="mb-4 text-xs font-black tracking-[0.3em] text-blue-600">
              CONTACT
            </p>

            <h1 className="text-4xl font-black tracking-[-0.05em] sm:text-5xl md:text-7xl">
              Get In Touch
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              We'd love to hear from you. Contact our team for
              products, dealership enquiries or technical support.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            <div className="rounded-[2rem] bg-white p-6 shadow-[0_25px_80px_rgba(15,23,42,0.07)] sm:p-8 md:p-10">
              <h2 className="text-2xl font-black sm:text-3xl">
                Contact Information
              </h2>

              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <Phone
                    className="mt-1 shrink-0 text-blue-600"
                    size={22}
                  />

                  <div>
                    <p className="text-sm font-bold text-slate-500">
                      Phone
                    </p>

                    <p className="mt-1 break-words text-lg font-bold sm:text-xl">
                      {settings.companyPhone || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail
                    className="mt-1 shrink-0 text-blue-600"
                    size={22}
                  />

                  <div>
                    <p className="text-sm font-bold text-slate-500">
                      Email
                    </p>

                    <p className="mt-1 break-words text-lg font-bold sm:text-xl">
                      {settings.companyEmail || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin
                    className="mt-1 shrink-0 text-blue-600"
                    size={22}
                  />

                  <div>
                    <p className="text-sm font-bold text-slate-500">
                      Address
                    </p>

                    <p className="mt-1 text-base leading-7 text-slate-700 sm:text-lg">
                      {settings.companyAddress || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {destination && (
                <a
                  href={destination}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-black text-white transition hover:bg-green-700 sm:w-auto"
                >
                  <MessageCircle size={19} />
                  WhatsApp Us
                </a>
              )}
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-[0_25px_80px_rgba(15,23,42,0.07)] sm:p-8 md:p-10">
              <h2 className="text-2xl font-black sm:text-3xl">
                Send Enquiry
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Submit the form and your enquiry will open directly
                in the Sizal HD WhatsApp chat.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-7 space-y-4"
              >
                <input
                  name="name"
                  required
                  className="min-h-12 w-full rounded-xl border p-4"
                  placeholder="Your Name"
                />

                <input
                  name="mobile"
                  required
                  inputMode="tel"
                  className="min-h-12 w-full rounded-xl border p-4"
                  placeholder="Mobile Number"
                />

                <input
                  name="email"
                  type="email"
                  className="min-h-12 w-full rounded-xl border p-4"
                  placeholder="Email (optional)"
                />

                <textarea
                  name="message"
                  required
                  rows={6}
                  className="w-full rounded-xl border p-4"
                  placeholder="Message"
                />

                <button
                  disabled={sending}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-black text-white transition hover:bg-blue-700 disabled:opacity-60 sm:w-auto"
                >
                  <Send size={18} />

                  {sending
                    ? "Opening WhatsApp..."
                    : "Send Enquiry on WhatsApp"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}