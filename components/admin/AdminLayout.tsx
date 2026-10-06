"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/firebase/auth";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const isLoginPage = pathname === "/admin/login";
      if (!user && !isLoginPage) { router.push("/admin/login"); return; }
      if (user && isLoginPage) { router.push("/admin/dashboard"); return; }
      setChecking(false);
    });
    return () => unsubscribe();
  }, [pathname, router]);

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  if (checking && pathname !== "/admin/login") return <main className="flex min-h-screen items-center justify-center bg-[#f4efe7] px-5 text-center"><p className="font-bold text-[#6f665e]">Checking admin access...</p></main>;
  if (pathname === "/admin/login") return <>{children}</>;

  return <div className="flex min-h-screen w-full min-w-0 max-w-full overflow-x-hidden bg-[#e8e1d7] text-[#2b2928]"><AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} /><div className="min-w-0 flex-1 overflow-x-hidden"><AdminTopbar onMenu={() => setSidebarOpen(true)} /><main className="min-w-0 max-w-full overflow-x-hidden p-4 sm:p-5 md:p-6 lg:p-8">{children}</main></div></div>;
}
