/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Zentomart Aura — Quiet Luxury palette
        // ---------------------------------------------------------------
        // Existing tokens are remapped to Aura values so no JSX changes needed
        cream: '#fcf9f8',           // surface / background (admin)
        paper: '#D4DFB7',           // storefront background — user site (sage 200)
        rosegold: {
          DEFAULT: '#6a5b5e',       // primary — sophisticated taupe
          light: '#d5c2c6',         // inverse-primary — dusty pink
          dark: '#514347',          // hover / deeper taupe
        },
        navy: '#1c1b1b',            // on-surface — soft black headings
        charcoal: '#1c1b1b',        // on-surface — soft black body
        blush: '#f9e4e8',           // primary-container — powdered pink

        // New Aura tokens
        gold: {
          DEFAULT: '#735c00',       // tertiary — sophisticated gold
          light: '#ffe7a8',         // tertiary-container
          dim: '#e9c349',           // tertiary-fixed-dim
          dark: '#574500',          // on-tertiary-fixed-variant
        },
        secondary: {
          DEFAULT: '#5e604d',       // warm olive
          light: '#e1e1c9',         // secondary-container
          dark: '#474836',
        },
        surface: {
          DEFAULT: '#fcf9f8',
          dim: '#dcd9d9',
          bright: '#fcf9f8',
          lowest: '#ffffff',
          low: '#f6f3f2',
          container: '#f0eded',
          high: '#eae7e7',
          highest: '#e5e2e1',
        },
        outline: {
          DEFAULT: '#7f7476',
          variant: '#d0c3c5',
        },
      },
      fontFamily: {
        // Noto Serif for editorial headings; Inter for body — per Aura system
        serif: ['"Noto Serif"', 'Georgia', 'serif'],
        sans: ['Inter', '"Poppins"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'caps': '0.15em',           // Aura label-caps tracking
      },
      borderRadius: {
        // Aura prefers sharp/architectural shapes — these are noticeably sharper
        // than Tailwind defaults but not 0, so existing rounded classes still feel polished.
        'sm': '2px',
        DEFAULT: '2px',
        'md': '2px',
        'lg': '4px',
        'xl': '4px',
        '2xl': '6px',
        '3xl': '8px',
        // 'full' kept at 9999px so avatars / color swatches / circular badges stay round
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'fade-in-up': 'fadeInUp 0.7s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'shake': 'shake 0.5s ease-in-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-in-out',
        'fly-to-cart': 'flyToCart 0.8s ease-in-out forwards',
        'shimmer': 'shimmer 1.6s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0) rotate(0)' },
          '25%': { transform: 'translateX(-4px) rotate(-3deg)' },
          '75%': { transform: 'translateX(4px) rotate(3deg)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-8px) scale(1.1)' },
        },
        flyToCart: {
          '0%': { transform: 'translate(0, 0) scale(1)', opacity: 1 },
          '100%': { transform: 'translate(var(--fly-x), var(--fly-y)) scale(0.2)', opacity: 0 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      boxShadow: {
        // Aura: weightless ambient shadows — high blur, very low opacity
        'luxury': '0 30px 60px -25px rgba(106, 91, 94, 0.18)',
        'soft': '0 10px 40px rgba(28, 27, 27, 0.04)',
        'editorial': '0 20px 60px rgba(28, 27, 27, 0.05)',
      },
    },
  },
  plugins: [],
}
