import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: [
    // "./index.html",
    // "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    // "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    // "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    daisyui
  ],
}

export default tailwindConfig;