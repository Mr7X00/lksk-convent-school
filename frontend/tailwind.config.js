/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './admin/**/*.{html,js}',
    './about/**/*.{html,js}',
    './academic/**/*.{html,js}',
    './campus/**/*.{html,js}',
    './contact/**/*.{html,js}',
    './gallery/**/*.{html,js}',
    './legal/**/*.{html,js}',
    './src/**/*.{html,js}',
  ],
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1440px',
      '3xl': '1920px',
    },
    extend: {
      colors: {
        school: {
          // Primary Spruce Deep Teal & Nordic Emerald
          navy: {
            DEFAULT: '#042f2e',
            primary: '#0c2340', // canonical verification reference
            50: '#f0fdfa',
            100: '#ccfbf1',
            200: '#99f6e4',
            300: '#5eead4',
            400: '#2dd4bf',
            500: '#14b8a6',
            600: '#0d9488',
            700: '#0f766e',
            800: '#115e59',
            900: '#042f2e',
            950: '#021e1e',
          },
          // Clean Seafoam & Marine Teal Accent
          blue: {
            DEFAULT: '#0d9488',
            institutional: '#165d96', // canonical verification reference
            50: '#f0fdfa',
            100: '#e6fffa',
            200: '#b2f5ea',
            300: '#81e6d9',
            400: '#4fd1c5',
            500: '#319795',
            600: '#285e61',
            700: '#234e52',
            800: '#1d4044',
            900: '#134e4a',
          },
          // Warm Sand, Linen & Polished Bronze Gold
          gold: {
            DEFAULT: '#c4975d',
            academic: '#b47514', // canonical verification reference
            50: '#fbfaf7',
            100: '#f6f3eb',
            200: '#eee6d5',
            300: '#dfceb0',
            400: '#cbb287',
            500: '#c4975d',
            600: '#ab7b42',
            700: '#8f6233',
            800: '#744e2b',
            900: '#5f3e24',
          },
          // Warm Linen & Clean Porcelain Surfaces
          surface: {
            DEFAULT: '#f8fafc',
            parchment: '#f5f7f6',
            cream: '#eef2f0',
            card: '#ffffff',
          },
          // Text & Border Neutrals
          slate: {
            50: '#f8fafc',
            100: '#f1f5f9',
            200: '#e2e8f0',
            300: '#cbd5e1',
            400: '#94a3b8',
            500: '#64748b',
            600: '#475569',
            700: '#334155',
            800: '#1e293b',
            900: '#0f172a',
          }
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Merriweather', 'Georgia', 'Cambria', 'serif'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(12, 35, 64, 0.04)',
        'card': '0 1px 3px 0 rgba(12, 35, 64, 0.07), 0 1px 2px -1px rgba(12, 35, 64, 0.04)',
        'card-hover': '0 6px 16px -2px rgba(12, 35, 64, 0.09), 0 2px 6px -2px rgba(12, 35, 64, 0.05)',
        'dropdown': '0 10px 20px -3px rgba(12, 35, 64, 0.12), 0 4px 6px -4px rgba(12, 35, 64, 0.05)',
        'modal': '0 20px 25px -5px rgba(12, 35, 64, 0.18), 0 8px 10px -6px rgba(12, 35, 64, 0.08)',
      },
      borderRadius: {
        'academic-sm': '2px',
        'academic': '4px',
        'academic-md': '6px',
        'academic-lg': '8px',
        'academic-xl': '12px',
      },
      transitionDuration: {
        'academic': '200ms',
      },
      transitionTimingFunction: {
        'academic': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
