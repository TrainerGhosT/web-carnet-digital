/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite-react/**/*.{js,ts,jsx,tsx}",  // ← incluye los componentes de Flowbite
  ],
  theme: {
    extend: {
      // extender si se ocupan colores en especificos
    },
  },
  plugins: [
    require("flowbite/plugin"),  // ← activa los estilos de Flowbite
  ],
};