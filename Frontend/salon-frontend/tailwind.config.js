/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        sans: ["'Sora'", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        ink: { DEFAULT: "#1B1410", 50: "#F7F4F0", 100: "#EEE7DD", 200: "#D9CBB8", 300: "#B9A489", 400: "#8F7860", 500: "#6B5744", 600: "#4E3F32", 700: "#382D24", 800: "#251E18", 900: "#1B1410", 950: "#100C09" },
        clay: { DEFAULT: "#B65C3D", 50: "#FBF0EB", 100: "#F5DCCF", 200: "#E8B39B", 300: "#DA8A67", 400: "#C97650", 500: "#B65C3D", 600: "#974A31", 700: "#763A27", 800: "#552A1C", 900: "#341A11" },
        moss: { DEFAULT: "#39543F", 50: "#EEF2EC", 100: "#D3DECC", 200: "#A9C09C", 300: "#7EA26B", 400: "#5C8A48", 500: "#39543F", 600: "#2F4735", 700: "#25392A", 800: "#1B2A1F", 900: "#111B14" },
        gold: { DEFAULT: "#C79A4B", 50: "#FBF5E9", 100: "#F3E3BE", 200: "#E7C888", 300: "#DBAD52", 400: "#C79A4B", 500: "#A87E36", 600: "#84632A" },
        cream: "#FBF7F0",
      },
      boxShadow: {
        ticket: "0 1px 2px rgba(27,20,16,0.06), 0 8px 24px -8px rgba(27,20,16,0.18)",
        soft: "0 1px 2px rgba(27,20,16,0.04), 0 2px 8px -2px rgba(27,20,16,0.08)",
      },
      backgroundImage: {
        grain: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },
      borderRadius: { xl2: "1.25rem" },
      keyframes: {
        "fade-up": { "0%": { opacity: 0, transform: "translateY(8px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        shimmer: { "0%": { backgroundPosition: "-400px 0" }, "100%": { backgroundPosition: "400px 0" } },
      },
      animation: { "fade-up": "fade-up 0.5s ease-out both", shimmer: "shimmer 1.6s infinite linear" },
    },
  },
  plugins: [],
};
