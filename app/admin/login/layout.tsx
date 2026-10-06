import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | Sizal HD",
  description: "Secure Sizal HD admin login panel.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}