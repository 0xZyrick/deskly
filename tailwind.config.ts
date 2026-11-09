import type { Config } from "tailwindcss";

/**
 * Deskly design tokens
 * - Standard Tailwind spacing scale (no overrides)
 * - `brand` = deep teal, the single accent colour
 * - `ink` = near-black text colour, slate for neutrals
 */
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#F5F7FA",
        ink: {
          DEFAULT: "#0B1220",
          soft: "#1E293B",
        },
        brand: {
          50: "#EFFAF8",
          100: "#D5F3EE",
          200: "#AAE6DD",
          300: "#74D1C5",
          400: "#40B7AA",
          500: "#1F9C90",
          600: "#0F7F76",
          700: "#0D655F",
          800: "#0E504C",
          900: "#0D423F",
          950: "#042A29",
        },
        danger: { DEFAULT: "#E11D48", soft: "#FFF1F2", dark: "#9F1239" },
        warn: { DEFAULT: "#D97706", soft: "#FFFBEB", dark: "#92400E" },
        ok: { DEFAULT: "#059669", soft: "#ECFDF5", dark: "#065F46" },
        info: { DEFAULT: "#0284C7", soft: "#F0F9FF", dark: "#075985" },
        violet: { soft: "#F5F3FF", dark: "#5B21B6" },
      },
      fontFamily: {
        heading: ["var(--font-bricolage)", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["var(--font-figtree)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-figtree)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "14px",
        "2xl": "18px",
        "3xl": "24px",
      },
      boxShadow: {
        xs: "0 1px 2px rgba(11,18,32,0.05)",
        card: "0 1px 2px rgba(11,18,32,0.04), 0 6px 20px -8px rgba(11,18,32,0.08)",
        pop: "0 16px 40px -12px rgba(11,18,32,0.22), 0 2px 6px rgba(11,18,32,0.06)",
        glow: "0 8px 28px -6px rgba(15,127,118,0.45)",
        ring: "0 0 0 4px rgba(31,156,144,0.18)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #0F7F76 0%, #0D655F 55%, #0E504C 100%)",
        "hero-glow":
          "radial-gradient(60% 50% at 80% 0%, rgba(64,183,170,0.35) 0%, rgba(64,183,170,0) 70%), radial-gradient(50% 40% at 0% 100%, rgba(15,127,118,0.28) 0%, rgba(15,127,118,0) 70%)",
        "grid-faint":
          "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "sheet-up": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-left": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        "toast-in": {
          from: { opacity: "0", transform: "translateY(12px) scale(0.98)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pop-check": {
          "0%": { transform: "scale(0.4)", opacity: "0" },
          "60%": { transform: "scale(1.12)", opacity: "1" },
          "100%": { transform: "scale(1)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "fade-in": "fade-in .2s ease-out both",
        "fade-up": "fade-up .45s cubic-bezier(.2,.7,.2,1) both",
        "scale-in": "scale-in .18s ease-out both",
        "sheet-up": "sheet-up .28s cubic-bezier(.2,.8,.2,1) both",
        "slide-left": "slide-left .28s cubic-bezier(.2,.8,.2,1) both",
        "toast-in": "toast-in .25s ease-out both",
        shimmer: "shimmer 1.6s linear infinite",
        "pop-check": "pop-check .5s cubic-bezier(.2,.8,.2,1) both",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
