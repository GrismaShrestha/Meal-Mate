/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "0.5rem",
        lg: "0",
      },
    },
    extend: {
      colors: {
        "primary-dark": "#455832",
        primary: "#4C7838",
        "primary-hover": "#426831",
        "primary-disabled": "#7c9772",
        "primary-light": "#A6CC98",
        "primary-very-light": "#A0C592",
      },
    },
  },
  plugins: [],
};
