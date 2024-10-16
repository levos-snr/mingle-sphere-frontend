const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      lineClamp: {
        3: '3',
      },
    },
  },
  plugins: [
    flowbite.plugin(),
  ],
}

