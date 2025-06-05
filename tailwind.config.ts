import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate"; // This was already here, so we keep it

const config: Config = {
  darkMode: ["class"], // This was from the original, keep it
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}", // Next.js specific for pages router (if used)
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}", // Common for components
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // Next.js specific for app router
  ],
  prefix: "", // From original, keep it
  theme: { // Keep the entire original theme
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        foreground: "hsl(var(--foreground))",
        background: {
          DEFAULT: "hsl(var(--background))",
          alt: "#F8FAFC",
        },
        primary: {
          DEFAULT: "#1A1F2C",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "#F97316",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "#E2E8F0",
          foreground: "hsl(var(--accent-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        neutral: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
          950: "#030712",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      keyframes: {
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
      },
    },
  },
  plugins: [animate], // Keep original plugins
};

export default config;
