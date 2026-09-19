/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coal: {
          900: '#0B0F19',
          800: '#111827',
          700: '#1F2937',
          600: '#374151',
        },
        accent: {
          emerald: '#10B981',
          amber: '#F59E0B',
          cyan: '#06B6D4',
          rose: '#F43F5E',
          indigo: '#6366F1'
        }
      }
    },
  },
  plugins: [],
}
