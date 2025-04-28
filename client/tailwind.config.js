import { defineConfig } from "tailwindcss";

export default defineConfig({
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        popover: "var(--color-popover)",
        "popover-foreground": "var(--color-popover-foreground)"
      }
    }
  }
});
