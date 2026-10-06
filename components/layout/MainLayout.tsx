import Navbar from "./Navbar";
import Footer from "./Footer";

type MainLayoutProps = {
  children: React.ReactNode;
};

export default function MainLayout({
  children,
}: MainLayoutProps) {
  return (
    <>
      <Navbar />

      <main className="min-h-screen overflow-hidden pt-20">
        {children}
      </main>

      <Footer />
    </>
  );
}