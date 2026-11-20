import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#eef3ff",
          100: "#dbe6ff",
          200: "#b6ccff",
          300: "#83a8f5",
          400: "#4f7fe0",
          500: "#2459c4",
          600: "#133f9e",
          700: "#0b2f7c",
          800: "#082361",
          900: "#061a49",
          950: "#031030",
        },
        brand: {
          400: "#ffae3d",
          500: "#ff9a1a",
          600: "#f07d00",
          700: "#c95f00",
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans Variable"', "system-ui", "sans-serif"],
        display: ['"Sora Variable"', "system-ui", "sans-serif"],
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        rise: {
          "0%": { transform: "translateY(0) scale(0.6)", opacity: "0" },
          "15%": { opacity: "0.7" },
          "100%": { transform: "translateY(-110vh) scale(1.1)", opacity: "0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.8)", opacity: "0.8" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
        spinSlow: {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        rise: "rise 14s linear infinite",
        marquee: "marquee 30s linear infinite",
        pulseRing: "pulseRing 2s ease-out infinite",
        spinSlow: "spinSlow 30s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
