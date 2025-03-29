/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderWidth: {
        '1': '1px', // Add a custom border width
      },
    },
  },
  plugins: [],
}

