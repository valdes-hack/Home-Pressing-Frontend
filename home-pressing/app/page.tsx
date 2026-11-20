import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Reveal from "@/components/Reveal";
import ServicesGrid from "@/components/ServicesGrid";
import ProcessSteps from "@/components/ProcessSteps";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";

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
      <h2 className="mt-5 font-display text-3xl font-extrabold sm:text-5xl">
        {title} <span className="text-gradient">{highlight}</span>
      </h2>
    </Reveal>
  );
}

export default function HomePage() {
  return (
    <>
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
    </>
  );
}
