"use client";

import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/auth";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin/dashboard");
    } catch (error) {
      alert("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
<main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#f4efe7] px-6 py-10">      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(227,30,36,0.12),transparent_32%),radial-gradient(circle_at_80%_80%,rgba(184,133,67,0.18),transparent_35%)]" />

      <div className="relative grid w-full max-w-5xl animate-[loginFade_0.7s_ease-out] overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/70 shadow-[0_35px_100px_rgba(90,70,45,0.18)] backdrop-blur-xl lg:grid-cols-[1fr_0.95fr]">
        <div className="hidden bg-[#080b12] p-10 text-white lg:block">
          <div className="rounded-3xl bg-white p-5">
            <Image
              src="/images/logo.png"
              alt="Sizal HD Lenses"
              width={320}
              height={120}
              className="h-auto w-full"
              priority
            />
          </div>

          <div className="mt-20">
            <p className="mb-4 text-xs font-black uppercase tracking-[0.32em] text-[#d8ad67]">
              Secure Access
            </p>

            <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.06em]">
              Control Your
              <span className="block text-[#d8ad67]">Lens Brand.</span>
            </h1>

            <p className="mt-6 leading-8 text-slate-300">
              Manage products, catalogue, gallery, dealers and website content
              from one protected admin panel.
            </p>
          </div>

          <div className="mt-16 rounded-3xl border border-white/10 bg-white/[0.06] p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="text-[#d8ad67]" />
              <div>
                <p className="font-black">Protected Admin Login</p>
                <p className="text-sm text-slate-400">
                  Firebase authentication enabled
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12">
          <div className="mb-10 lg:hidden">
            <Image
              src="/images/logo.png"
              alt="Sizal HD Lenses"
              width={260}
              height={100}
              className="mx-auto h-auto"
              priority
            />
          </div>

          <p className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-[#a85f45]">
            Admin Panel
          </p>

          <h2 className="text-5xl font-black tracking-[-0.06em] text-[#2d2925]">
            Welcome Back
          </h2>

          <p className="mt-4 text-[#6f665e]">
            Sign in to continue to Sizal HD dashboard.
          </p>

          <form onSubmit={handleLogin} className="mt-10 space-y-5">
            <div className="relative">
              <Mail
                size={20}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8b5736]"
              />
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-[#d8cfc3] bg-white px-14 py-5 outline-none transition focus:border-[#a85f45]"
              />
            </div>

            <div className="relative">
              <Lock
                size={20}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8b5736]"
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-[#d8cfc3] bg-white px-14 py-5 pr-14 outline-none transition focus:border-[#a85f45]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-[#8b5736]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-[#9a5a41] to-[#d8ad67] px-6 py-5 font-black text-white shadow-[0_15px_40px_rgba(154,90,65,0.28)] transition hover:-translate-y-1 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login to Dashboard"}
            </button>
            <div className="mt-8 border-t border-[#e7ddd0] pt-5 text-center">
  <p className="text-xs text-[#8b8178]">
    © 2026 Sizal HD Lenses
  </p>

  <p className="mt-1 text-xs text-[#8b8178]">
    Powered by{" "}
    <a
      href="https://arvikdigital.in"
      target="_blank"
      rel="noopener noreferrer"
      className="font-bold text-[#a85f45] transition hover:text-[#8b5736] hover:underline"
    >
      Arvik Digital
    </a>
  </p>
</div>
          </form>
        </div>
      </div>

    </main>
  );
}