import { nextui } from "@nextui-org/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/react/**/*.{js,ts,jsx,tsx}", // <-- HeroUI
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            background: "#FFFFFF",
            foreground: "#000000",
            primary: {
              foreground: "#6B7280",
              DEFAULT: "#1F2937",
            },
          },
        },
        dark: {
          colors: {
            background: "#000000",
            foreground: "#FFFFFF",
            primary: {
              foreground: "#FFFFFF",
              DEFAULT: "#1F2937",
            },
          },
        },
      },
    }),
  ],
};
