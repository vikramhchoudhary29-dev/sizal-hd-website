"use client";

import { LogOut, Menu } from "lucide-react";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/auth";
import { getAdminAuthHeaders } from "@/lib/api/adminToken";

type AdminProfile = { name: string; email: string; role: string };
const roleLabels: Record<string, string> = { owner: "Owner", super_admin: "Super Administrator", admin: "Administrator", editor: "Editor" };

export default function AdminTopbar({ onMenu }: { onMenu: () => void }) {
  const router = useRouter();
  const [profile, setProfile] = useState<AdminProfile | null>(null);

  useEffect(() => {
    let cancelled = false;
    getAdminAuthHeaders().then((headers) => fetch("/api/admin/me", { headers, cache: "no-store" })).then((response) => response.json()).then((json) => { if (!cancelled) setProfile(json.admin || null); }).catch(() => undefined);
    return () => { cancelled = true; };
  }, []);

  async function handleLogout() { await signOut(auth); router.push("/admin/login"); }
  const name = profile?.name || "Admin";
  const role = roleLabels[profile?.role || ""] || "Administrator";
  const initial = name.trim().charAt(0).toUpperCase() || "A";

  return <header className="sticky top-0 z-30 border-b border-[#d4c8b9] bg-[#f4efe7]/90 px-4 py-3 backdrop-blur-xl sm:px-5 sm:py-4 lg:px-8"><div className="flex items-center justify-between gap-3"><button type="button" onClick={onMenu} className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#d8cfc3] bg-white/70 lg:hidden" aria-label="Open admin navigation"><Menu size={22} /></button><div className="ml-auto flex items-center gap-2 sm:gap-4"><button onClick={handleLogout} className="flex h-11 items-center gap-2 rounded-xl border border-[#d8cfc3] bg-white/70 px-3 font-semibold text-[#2d2925] transition hover:bg-[#2d2925] hover:text-white sm:h-auto sm:rounded-2xl sm:px-5 sm:py-3"><LogOut size={17} /><span className="hidden sm:inline">Logout</span></button><div className="flex items-center gap-2 rounded-xl border border-[#d8cfc3] bg-white/70 px-2.5 py-2 shadow-sm sm:gap-3 sm:rounded-2xl sm:px-4 sm:py-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#9a5a41] to-[#d8ad67] text-sm font-black text-white sm:h-11 sm:w-11">{initial}</div><div className="hidden sm:block"><p className="font-black text-[#2d2925]">{name}</p><p className="text-xs text-[#7a7067]">{role}</p></div></div></div></div></header>;
}
