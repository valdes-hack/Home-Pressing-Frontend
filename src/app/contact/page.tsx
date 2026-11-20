import type { Metadata } from "next";
import { Clock, Mail, MessageCircle, Phone } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import { BRAND } from "@/lib/data";

export const metadata: Metadata = { title: "Contact — Home Pressing" };

const infos = [
  { icon: Phone, label: "Téléphone", value: BRAND.phone },
  { icon: MessageCircle, label: "WhatsApp", value: BRAND.phone },
  { icon: Mail, label: "E-mail", value: BRAND.email },
  { icon: Clock, label: "Horaires", value: BRAND.hours },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Parlons de"
        highlight="votre linge"
        subtitle="Une question, une réclamation, un devis pour votre entreprise ? Écrivez-nous, on vous répond vite."
      />
      <section className="section !pt-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
          <div className="grid content-start gap-4">
            {infos.map((x, i) => {
              const Icon = x.icon;
              return (
                <Reveal key={x.label} delay={i * 0.08} direction="right">
                  <div className="glass flex items-center gap-4 rounded-2xl p-5 transition-transform hover:-translate-y-1">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-navy-950">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-white/45">{x.label}</p>
                      <p className="font-semibold">{x.value}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <Reveal direction="left">
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
