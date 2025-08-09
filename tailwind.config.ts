import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#F4F5F5', // cultured
          100: '#FAFAFA', // white-ish
          200: '#CFE6EE',
          300: '#A6D3DF',
          400: '#81BECE', // dark sky blue
          500: '#378BA4', // blue munsell
          600: '#036280', // blue sapphire
          700: '#012E4A', // prussian blue
          800: '#212A30', // gunmetal
          900: '#111518', // rich black
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
