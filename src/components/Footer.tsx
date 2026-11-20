import Image from "next/image";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { BRAND, NAV_LINKS } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="relative z-10 mt-10 border-t border-white/10 bg-navy-950/80 backdrop-blur">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <span className="relative block h-12 w-12 overflow-hidden rounded-xl">
              <Image src="/logo.png" alt="Home Pressing" fill sizes="48px" className="object-cover" />
            </span>
            <span className="font-display text-xl font-bold">
              Home <span className="text-brand-500">Pressing</span>
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
            {BRAND.tagline} 6 agences à Yaoundé, un atelier central, un suivi
            transparent de chaque vêtement.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-400">
            Navigation
          </h4>
          <ul className="space-y-2 text-sm text-white/70">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-brand-400">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-400">
            Contact
          </h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" /> {BRAND.phone}
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" /> {BRAND.email}
            </li>
            <li className="flex gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" /> {BRAND.hours}
            </li>
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" /> Yaoundé, Cameroun
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Home Pressing. Tous droits réservés.
      </div>
    </footer>
  );
}
