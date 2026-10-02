import WebsiteNavbar from "../components/website/WebsiteNavbar";
import Hero from "../components/sections/Hero";
import Technologies from "../components/sections/Technologies";
import Products from "../components/sections/Products";
import Compare from "../components/sections/Compare";
import Dealer from "../components/sections/Dealer";
import AboutBrand from "../components/sections/AboutBrand";
import MobileApp from "../components/sections/MobileApp";
import Footer from "../components/layout/Footer";
import Stats from "../components/sections/Stats";
import Gallery from "../components/sections/Gallery";
export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8FBFF] text-slate-950">
      <WebsiteNavbar />
      <Hero />
      
           <Technologies />
      <Products />
      <Gallery />
      <Stats />
      <Compare />
      <Dealer />
      <AboutBrand />
      <MobileApp />
      <Footer />
    </main>
  );
}