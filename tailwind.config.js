/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
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
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "#f0f9ff",  // Light background (with dark text)
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",  // Main brand color
          600: "#0284c7",  // Darker for better contrast on light backgrounds
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",  // Darkest - for text on light backgrounds
          950: "#082f49",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        google: {
          primary: '#4285F4', // Google blue
          success: '#34A853', // Google green
          danger: '#EA4335',  // Google red
          warning: '#FBBC05', // Google yellow
          background: '#F8F9FA',
          card: '#FFFFFF',
          text: '#202124',
          muted: '#5F6368'
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontSize: {
        // Ensure base size is at least 16px
        xs: ["0.875rem", { lineHeight: "1.5" }],      // 14px with 21px line height
        sm: ["0.9375rem", { lineHeight: "1.5" }],     // 15px with 22.5px line height
        base: ["1rem", { lineHeight: "1.5" }],        // 16px with 24px line height
        lg: ["1.125rem", { lineHeight: "1.5" }],      // 18px with 27px line height
        xl: ["1.25rem", { lineHeight: "1.5" }],       // 20px with 30px line height
        "2xl": ["1.5rem", { lineHeight: "1.33" }],    // 24px with 32px line height
        "3xl": ["1.875rem", { lineHeight: "1.2" }],   // 30px with 36px line height
        "4xl": ["2.25rem", { lineHeight: "1.11" }],   // 36px with 40px line height
        "5xl": ["3rem", { lineHeight: "1" }],         // 48px with 48px line height
      },
      lineHeight: {
        tight: "1.2",
        snug: "1.33",
        normal: "1.5",
        relaxed: "1.75",
      },
      letterSpacing: {
        tighter: "-0.05em",
        tight: "-0.025em",
        normal: "0",
        wide: "0.025em",
        wider: "0.05em",
        widest: "0.1em",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      spacing: {
        // Ensure adequate spacing for touch targets
        '18': '4.5rem',  // 72px - good for larger touch targets
        '22': '5.5rem',  // 88px
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/forms')({ strategy: 'class' }),
  ],
}