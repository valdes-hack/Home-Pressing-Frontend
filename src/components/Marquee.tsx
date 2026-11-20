const items = [
  "Lavage à sec",
  "Lavage à l'eau",
  "Repassage",
  "Literie & couettes",
  "Chemises & uniformes",
  "Tenues de cérémonie",
  "SMS automatique",
  "Suivi de commande",
];

/** Bandeau défilant infini. */
export default function Marquee() {
  const row = [...items, ...items];
  return (
    <div className="relative z-10 overflow-hidden border-y border-white/10 bg-white/[0.03] py-5 backdrop-blur">
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
        {row.map((t, i) => (
          <span
            key={i}
            className="flex items-center gap-12 font-display text-lg font-semibold text-white/70"
          >
            {t}
            <span className="h-2 w-2 rounded-full bg-brand-500" />
          </span>
        ))}
      </div>
    </div>
  );
}
