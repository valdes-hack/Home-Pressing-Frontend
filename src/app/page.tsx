import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Reveal from "@/components/Reveal";
import ServicesGrid from "@/components/ServicesGrid";
import ProcessSteps from "@/components/ProcessSteps";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import Bubbles from "@/components/Bubbles";
import ScrollProgress from "@/components/ScrollProgress";

function SectionTitle({
  eyebrow,
  title,
  highlight,
}: {
  eyebrow: string;
  title: string;
  highlight: string;
}) {
  return (
    <Reveal className="mx-auto mb-14 max-w-2xl text-center">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="mt-5 text-3xl font-extrabold sm:text-5xl text-white">
        {title} <span className="text-gradient">{highlight}</span>
      </h2>
    </Reveal>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-navy-950 text-white relative overflow-x-hidden selection:bg-brand-500 selection:text-slate-950">
      <ScrollProgress />
      <Bubbles />
      <Navbar />

      <div className="pt-24">
        <Hero />
        <Marquee />

        <section className="section">
          <SectionTitle eyebrow="Nos services" title="Un soin sur mesure pour" highlight="chaque tissu" />
          <ServicesGrid />
        </section>

        <section className="section">
          <SectionTitle eyebrow="Comment ça marche" title="Simple, rapide et" highlight="transparent" />
          <ProcessSteps />
        </section>

        <section className="section">
          <Stats />
        </section>

        <section className="section">
          <SectionTitle eyebrow="Témoignages" title="Ils nous font" highlight="confiance" />
          <Testimonials />
        </section>

        <section className="section !pt-6">
          <CTA />
        </section>

        <Footer />
      </div>
    </main>
  );
}
