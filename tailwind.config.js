/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./App.tsx",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,tx,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#491B6D",
      },
      fontFamily: {
        gilroy: ["regular"], // matches key in useFonts
        gilroyBold: ["bold"],
        gilroyHeavy: ["heavy"],
        gilroySemiBold: ["semibold"],
        gilroyExtraBold: ["extrabold"],
      },
    },
  },
  plugins: [],
};
