import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        civic: {
          bg: "#eef4f2",
          paper: "#f8fbf7",
          ink: "#11253f",
          muted: "#667488",
          line: "rgba(17, 37, 63, 0.12)",
          blue: "#0067A0",
          red: "#da291c",
          cyan: "#55c7d9",
          green: "#b7d969",
          gold: "#f5c542",
          purple: "#6f5bd7"
        },
        cream: "#fff8ed",
        ink: "#20302a",
        moss: "#4f7d5b",
        clay: "#b96f4b",
        sun: "#f3b95f"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(55, 73, 63, 0.12)",
        civic: "0 22px 60px rgba(17, 37, 63, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
