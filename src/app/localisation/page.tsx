import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import LocationExplorer from "@/components/LocationExplorer";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Localisation — Home Pressing",
  description: "Trouvez l'agence Home Pressing la plus proche de vous à Yaoundé.",
};

export default function LocalisationPage() {
  return (
    <>
      <PageHeader
        eyebrow="Localisation"
        title="Une agence près de"
        highlight="chez vous"
        subtitle="6 agences à Yaoundé et un atelier central. Choisissez un quartier pour voir l'adresse, les horaires et l'itinéraire."
      />
      <section className="section !pt-12">
        <Reveal>
          <LocationExplorer />
        </Reveal>
      </section>
    </>
  );
}
