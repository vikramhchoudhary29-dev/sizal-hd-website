import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";   


export const metadata: Metadata = {
  title: "Sizal HD Lenses",
  description: "Premium spectacle lens technology.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
   <html lang="en" data-scroll-behavior="smooth">
  <body>
    {children}
    <Toaster richColors position="top-right" />
  </body>
</html>
  );
}