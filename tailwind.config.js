/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",          // App Router
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",        // Pages Router (kalau pakai)
    "./components/**/*.{js,ts,jsx,tsx,mdx}",   // Komponen custom
    "./src/**/*.{js,ts,jsx,tsx,mdx}",          // Kalau ada folder src
    // Penting buat OnchainKit (RainbowKit/Wagmi biasanya aman tanpa ini)
    "./node_modules/@coinbase/onchainkit/**/*.js",
  ],
  theme: {
    extend: {
      // Optional: tambah custom theme kalau perlu
      colors: {
        // Contoh custom warna Base
        baseblue: '#0052FF',
        basegreen: '#00C4B4',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};