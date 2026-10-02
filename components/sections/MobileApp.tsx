export default function MobileApp() {
  return (
    <section
      id="app"
      className="bg-[#f7fbff] px-5 py-24 md:px-12 md:py-28 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-[#E31E24]">
            SIZAL HD SMART APP
          </p>

          <h2 className="text-4xl font-black tracking-[-0.05em] text-slate-950 md:text-6xl">
            Smart Lens Ordering App
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Search products, check stock availability, compare prices and place
            orders instantly with the official Sizal HD Dealer App.
          </p>
        </div>

        <div className="overflow-hidden rounded-[2.5rem] border border-white bg-white shadow-[0_35px_100px_rgba(15,23,42,0.12)]">
          <img
            src="/images/app-banner.png"
            alt="Sizal HD App"
            className="h-auto w-full"
          />
        </div>

        <div className="mt-10 flex justify-center">
          <a
            href="https://play.google.com/store/apps/details?id=com.techcherry.SIZAL_HDLENSES"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl bg-black px-10 py-4 text-lg font-bold text-white shadow-xl transition duration-300 hover:-translate-y-1 hover:bg-[#E31E24]"
          >
            Download on Google Play
          </a>
        </div>
      </div>
    </section>
  );
}