const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const { nextui } = require('@nextui-org/react');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
    "../../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui({
    themes: {
      light: {
        colors: {
          primary: {
            50: "#eff6ff",
            100: "#dbeafe",
            200: "#bfdbfe",
            300: "#93c5fd",
            400: "#60a5fa",
            500: "#3b82f6",
            600: "#2563eb",
            700: "#1d4ed8",
            800: "#1e40af",
            900: "#1e3a8a",
            DEFAULT: "#3b82f6",
            foreground: "#ffffff",
          },
          focus: "#3b82f6",
        },
      },
      dark: {
        colors: {
          primary: {
            50: "#1e1e2e",
            100: "#313244",
            200: "#45475a",
            300: "#585b70",
            400: "#6c7086",
            500: "#7f849c",
            600: "#9399b2",
            700: "#a6adc8",
            800: "#bac2de",
            900: "#cdd6f4",
            DEFAULT: "#89b4fa",
            foreground: "#1e1e2e",
          },
          focus: "#89b4fa",
        },
      },
    },
  })],
};