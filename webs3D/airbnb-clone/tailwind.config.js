/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        rausch: "#FF385C",
        babu: "#00A699",
        hof: "#484848",
        foggy: "#767676"
      },
      fontFamily: {
        sans: ["Circular", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        airbnb: "0 6px 20px rgba(0,0,0,0.08)",
        search: "0 2px 4px rgba(0,0,0,0.18)"
      }
    }
  },
  plugins: []
};
