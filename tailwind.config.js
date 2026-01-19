/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // Semantic background colors
        main: 'var(--bg-main)',
        card: 'var(--bg-card)',
        'card-solid': 'var(--bg-card-solid)',
        element: 'var(--bg-element)',
        'element-solid': 'var(--bg-element-solid)',

        // Semantic text colors
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        muted: 'var(--text-muted)',

        // Border colors
        border: 'var(--border-color)',
        'border-glow': 'var(--border-glow)',

        // Accent colors with full palette
        accent: {
          DEFAULT: 'var(--accent-color)',
          glow: 'var(--accent-glow)',
          'text-contrast': 'var(--text-on-accent)',
          pink: 'var(--accent-pink)',
          magenta: 'var(--accent-magenta)',
          cyan: 'var(--accent-cyan)',
          orange: 'var(--accent-orange)',
          green: 'var(--accent-green)',
          blue: 'var(--accent-blue)',
        }
      },
      boxShadow: {
        'glow-purple': '0 0 30px rgba(139, 92, 246, 0.4)',
        'glow-pink': '0 0 30px rgba(236, 72, 153, 0.4)',
        'glow-cyan': '0 0 30px rgba(6, 182, 212, 0.4)',
        'glow-orange': '0 0 30px rgba(249, 115, 22, 0.4)',
        'card-dark': '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.03) inset',
        'card-elevated': '0 12px 40px rgba(0, 0, 0, 0.5), 0 0 60px rgba(139, 92, 246, 0.08)',
      },
      backdropBlur: {
        'xl': '24px',
      },
      backgroundImage: {
        'gradient-pink': 'linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #fb7185 100%)',
        'gradient-purple': 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
        'gradient-cyan': 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%)',
        'gradient-orange': 'linear-gradient(135deg, #f97316 0%, #fb923c 100%)',
      },
    },
  },
  plugins: [],
}
