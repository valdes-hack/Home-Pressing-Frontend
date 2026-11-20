import React from 'react';

interface LogoProps {
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Logo({ theme = 'light', size = 'md', className = '' }: LogoProps) {
  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-[#0e2a47]';
  const goldColor = isDark ? '#facc15' : '#c99824';
  const hookColor = isDark ? '#ffffff' : '#0e2a47';

  const scale = size === 'sm' ? 'scale-75' : size === 'lg' ? 'scale-125' : 'scale-100';

  return (
    <div className={`flex flex-col items-center select-none ${scale} ${className}`}>
      {/* Cintre stylisé avec courbes dorées */}
      <svg
        width="110"
        height="55"
        viewBox="0 0 110 55"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        {/* Crochet du cintre */}
        <path
          d="M 55 24 C 55 17 59 12 55 7 C 52 3 47 6 49 10 C 50 12 53 13 53 16 C 53 19 50 22 47 24"
          stroke={hookColor}
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="49" cy="9.5" r="1.5" fill={hookColor} />

        {/* Corps supérieur du cintre */}
        <path
          d="M 22 36 Q 55 23 88 36"
          stroke={hookColor}
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Arche dorée supérieure */}
        <path
          d="M 16 40 Q 55 18 94 40"
          stroke="url(#goldGradient)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Arche dorée inférieure / ruban */}
        <path
          d="M 30 43 Q 55 28 80 43"
          stroke="url(#goldGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#b48318" />
            <stop offset="50%" stopColor="#f5ce62" />
            <stop offset="100%" stopColor="#c59b27" />
          </linearGradient>
        </defs>
      </svg>

      {/* Texte Marque */}
      <div className="text-center -mt-1">
        <h1
          className={`font-extrabold text-[18px] tracking-[0.14em] leading-tight ${textColor}`}
          style={{ fontFamily: "'Montserrat', 'Cinzel', system-ui, sans-serif" }}
        >
          ATLANTIC PALACE
        </h1>
        <div className="flex items-center justify-center gap-2 mt-0.5">
          <span className="h-[1px] w-6 bg-gradient-to-r from-transparent to-[#c99824]"></span>
          <span
            className="text-[10px] font-bold tracking-[0.3em] uppercase"
            style={{ color: goldColor }}
          >
            PRESSING
          </span>
          <span className="h-[1px] w-6 bg-gradient-to-l from-transparent to-[#c99824]"></span>
        </div>
      </div>
    </div>
  );
}
