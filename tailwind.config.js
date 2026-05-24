/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Quantze — Cerulean Companion palette (Style 1)
        ink:      '#0B0D10',
        paper:    '#FFFFFF',
        platinum: '#F2F4F7',
        mist:     '#E6EAF0',
        haze:     '#CDD4DE',
        slate2:   '#6B7280',
        slate1:   '#9AA3AE',
        cerulean: '#2563EB',
        ceruleanDark: '#1E40AF',
        ceruleanGlow: '#3B82F6',
        gold:     '#C9A24B',
        goldHi:   '#E0BB68',
        emerald2: '#0F9D58',
        positive: '#10B981',
        negative: '#E24A4A',
        warn:     '#F59E0B',
        teal:     '#00BFA6',
        violet2:  '#7C5CFF',
        // Obsidian (used for terminal/dark blocks within the same site)
        obsidian: '#050608',
        onyx:     '#111318',
        carbon:   '#1A1D24',
        graphite: '#262B33',
      },
      fontFamily: {
        display: ['"Canela"', '"Playfair Display"', '"Source Serif 4"', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono:  ['"JetBrains Mono"', '"IBM Plex Mono"', 'ui-monospace', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        'wider2': '0.14em',
        'wider3': '0.22em',
      },
      boxShadow: {
        'glass': '0 1px 0 rgba(255,255,255,0.6) inset, 0 8px 28px -12px rgba(11,13,16,0.18)',
        'glow':  '0 0 0 1px rgba(37,99,235,0.18), 0 8px 32px -8px rgba(37,99,235,0.32)',
        'gold':  '0 0 0 1px rgba(201,162,75,0.35), 0 6px 22px -8px rgba(201,162,75,0.45)',
        'card':  '0 1px 2px rgba(11,13,16,0.04), 0 1px 0 rgba(11,13,16,0.04)',
        'lift':  '0 12px 36px -16px rgba(11,13,16,0.18), 0 1px 0 rgba(11,13,16,0.06)',
      },
      animation: {
        'pulse-slow': 'pulse 3.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'tick': 'tick 2s linear infinite',
        'shimmer': 'shimmer 2.6s linear infinite',
      },
      keyframes: {
        tick: {
          '0%, 100%': { opacity: '0.6' },
          '50%':       { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
