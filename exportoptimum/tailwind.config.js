module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",  // Make sure all your JSX files are in the content array
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Example: Inter for sans-serif
        serif: ["Merriweather", "serif"], // Example: Merriweather for serif
      },
      colors: {
        avocado: {
          light: "#E2F0CB", // Light avocado green
          dark: "#4A6B3D",  // Dark avocado green
        },
      },
    },
  },
  plugins: [],
}
