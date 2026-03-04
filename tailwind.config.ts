import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#020817",
        foreground: "#E5E7EB",
        card: "#020617",
        "card-foreground": "#E5E7EB",
        border: "#111827",
        muted: "#111827",
        "muted-foreground": "#9CA3AF",
        accent: "#4B5563"
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem"
      }
    }
  },
  plugins: [
    require("@tailwindcss/typography")
  ]
};

export default config;

