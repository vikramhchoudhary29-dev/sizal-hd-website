import WebsiteNavbar from "@/components/website/WebsiteNavbar";
import Footer from "@/components/layout/Footer";

export default function AboutPage() {
  return (
    <>
      <WebsiteNavbar />

      <main className="min-h-screen bg-[#F8FBFF] px-6 pb-20 pt-40 md:px-20">
        <section className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <p className="mb-4 text-xs font-black tracking-[0.3em] text-blue-600">
              ABOUT SIZAL HD
            </p>

            <h1 className="text-5xl font-black tracking-tight md:text-7xl">
              Premium Vision Technology
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              Sizal HD Lenses is dedicated to delivering premium spectacle lens
              solutions designed for clarity, comfort and protection in everyday
              life.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-[2rem] border bg-white p-8 shadow-sm">
              <h2 className="mb-4 text-2xl font-black">Our Mission</h2>
              <p className="leading-8 text-slate-600">
                To provide advanced optical lens technology that improves vision
                quality, enhances comfort and supports modern lifestyles.
              </p>
            </div>

            <div className="rounded-[2rem] border bg-white p-8 shadow-sm">
              <h2 className="mb-4 text-2xl font-black">Our Vision</h2>
              <p className="leading-8 text-slate-600">
                To become a trusted premium lens brand known for innovation,
                reliability and strong dealer partnerships across India.
              </p>
            </div>

            <div className="rounded-[2rem] border bg-white p-8 shadow-sm">
              <h2 className="mb-4 text-2xl font-black">Quality Commitment</h2>
              <p className="leading-8 text-slate-600">
                Every Sizal HD product is developed with a focus on optical
                clarity, durable coatings and consistent performance.
              </p>
            </div>
          </div>

          <div className="mt-20 rounded-[2rem] bg-slate-950 p-10 text-white md:p-14">
            <p className="mb-4 text-xs font-black tracking-[0.3em] text-cyan-300">
              WHY CHOOSE US
            </p>

            <h2 className="text-4xl font-black tracking-tight md:text-6xl">
              Built for Optical Professionals
            </h2>

            <p className="mt-6 max-w-4xl text-lg leading-9 text-slate-300">
              Sizal HD supports optical dealers with premium products, technical
              information, catalogues, brand communication and a growing digital
              ecosystem.
            </p>

            <div className="mt-10 grid gap-5 md:grid-cols-4">
              {[
                "Premium Lens Range",
                "Dealer Support",
                "Modern Technology",
                "Trusted Quality",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 font-bold"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}