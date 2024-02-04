/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      colors: {
        gold: "#F8B179",
        navy2: "#283845",
        navy1: "#212D3B",
        latte: "#F2D494",
        moca: "#B9AF8C",
        brown: "#B27735",
      },
      fontFamily: {
        "playfair-display": ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("flowbite/plugin")],
};
