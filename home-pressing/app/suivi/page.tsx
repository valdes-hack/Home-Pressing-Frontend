import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import TrackingDemo from "@/components/TrackingDemo";

export const metadata: Metadata = { title: "Suivi de commande — Home Pressing" };

export default function SuiviPage() {
  return (
    <>
      <PageHeader
        eyebrow="Suivi de commande"
        title="Où en est"
        highlight="votre linge ?"
        subtitle="Saisissez le numéro de votre bordereau pour connaître l'avancement : réceptionné, en lavage, en repassage, prêt."
      />
      <section className="section !pt-12">
        <TrackingDemo />
      </section>
    </>
  );
}
