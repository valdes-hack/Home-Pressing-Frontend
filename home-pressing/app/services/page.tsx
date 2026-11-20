import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ServicesGrid from "@/components/ServicesGrid";
import ProcessSteps from "@/components/ProcessSteps";
import Reveal from "@/components/Reveal";
import CTA from "@/components/CTA";

export const metadata: Metadata = { title: "Services — Home Pressing" };

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Nos services"
        title="Tout pour prendre soin de"
        highlight="votre linge"
        subtitle="Du vêtement du quotidien aux tenues de cérémonie, chaque article est constaté, tracé et traité avec le plus grand soin."
      />
      <section className="section !pt-12">
        <ServicesGrid />
      </section>
      <section className="section !pt-0">
        <Reveal className="mb-14 text-center">
          <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
            Le parcours de <span className="text-gradient">votre commande</span>
          </h2>
        </Reveal>
        <ProcessSteps />
      </section>
      <section className="section !pt-6">
        <CTA />
      </section>
    </>
  );
}
