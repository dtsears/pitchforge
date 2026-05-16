import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Display serif — Fraunces via Google Fonts
        display: ["Fraunces", "ui-serif", "Georgia", "serif"],
        // UI body — system sans
        sans: ["Geist Sans", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        // Bluehost brand (V1 hardcoded)
        bluehost: {
          blue: "#003087",
          mid: "#0057B8",
          light: "#E8F0FF",
        },
        // Base palette: stone + amber
        stone: {
          50: "#fafaf9",
          100: "#f5f5f4",
          200: "#e7e5e4",
          300: "#d6d3d1",
          400: "#a8a29e",
          500: "#78716c",
          600: "#57534e",
          700: "#44403c",
          800: "#292524",
          900: "#1c1917",
          950: "#0c0a09",
        },
        amber: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },
      },
      letterSpacing: {
        display: "-0.03em",
        tight: "-0.015em",
      },
      typography: {
        DEFAULT: {
          css: {
            fontFamily: "Fraunces, ui-serif, Georgia, serif",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
