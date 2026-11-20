"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Bubbles from "@/components/Bubbles";
import ScrollProgress from "@/components/ScrollProgress";
import WhatsAppButton from "@/components/WhatsAppButton";

const ADMIN_ROUTES = ["/dg", "/comptoir", "/caisse", "/atelier", "/espace-client"];

export default function ShowcaseShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));

  // Si nous sommes dans l'espace de gestion ou l'espace client connecté, pas de Navbar boutique
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // Pour toutes les pages vitrine (Accueil, Services, Suivi, Localisation, Contact, Connexion/Inscription) :
  // Le Header Navbar est TOUJOURS visible et ne disparaît jamais lors des changements d'onglets !
  return (
    <div className="relative min-h-screen bg-navy-950 text-white selection:bg-brand-500 selection:text-slate-950 flex flex-col justify-between overflow-x-hidden">
      <ScrollProgress />
      <Bubbles />
      <Navbar />
      <main className="relative z-10 pt-20 flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
