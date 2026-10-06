import Container from "@/components/ui/Container";

export default function Downloads() {
  return (
    <section id="downloads" className="bg-white py-24 md:py-32">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-[#E31E24]">
            Downloads
          </p>

          <h2 className="text-4xl font-black tracking-[-0.05em] text-slate-950 md:text-6xl">
            Everything Dealers Need
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Access catalogues, brochures, warranty information and price list
            documents for Sizal HD products.
          </p>
        </div>
      </Container>
    </section>
  );
}