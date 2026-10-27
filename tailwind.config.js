/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        app: "var(--color-bg-app)",
        card: "var(--color-bg-card)",
        input: "var(--color-bg-input)",

        primary: {
          DEFAULT: "var(--color-primary)",
          soft: "var(--color-primary-soft)",
        },

        status: {
          success: "var(--color-success)",
          "success-bg": "var(--color-success-bg)",
          danger: "var(--color-danger)",
          "danger-bg": "var(--color-danger-bg)",
          warning: "var(--color-warning)",
          "warning-bg": "var(--color-warning-bg)",
        },

        main: "var(--color-text-main)",
        muted: "var(--color-text-muted)",
        light: "var(--color-text-light)",

        border: {
          DEFAULT: "var(--color-border)",
          subtle: "var(--color-border-subtle)",
        },
      },
    },
  },
  plugins: [],
};
