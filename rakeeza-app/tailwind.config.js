import daisyui from 'daisyui'
import forms from '@tailwindcss/forms'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        canvas: 'hsl(var(--b1) / <alpha-value>)',
        surface: 'hsl(var(--b2, var(--b1)) / <alpha-value>)',
        accent: 'hsl(var(--a) / <alpha-value>)',
        ink: 'hsl(var(--bc) / <alpha-value>)',
        steel: 'hsl(var(--bc) / 0.65)',
        whisper: 'hsl(var(--bc) / 0.18)',
      },
      boxShadow: {
        diffused: '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [daisyui, forms],
  daisyui: {
    themes: [
      {
        light: {
          "color-scheme": "light",
          "primary": "#2563eb",
          "secondary": "#8b5cf6",
          "accent": "#4f46e5",
          "neutral": "#f1f5f9",
          "base-100": "#ffffff",
          "base-200": "#f8fafc",
          "base-300": "#e2e8f0",
          "base-content": "#0f172a",
          "info": "#0ea5e9",
          "success": "#22c55e",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
        dark: {
          "color-scheme": "dark",
          "primary": "#3b82f6",
          "secondary": "#d946ef",
          "accent": "#8b5cf6",
          "neutral": "#1e293b",
          "base-100": "#0f172a",
          "base-200": "#1e293b",
          "base-300": "#334155",
          "base-content": "#f8fafc",
          "info": "#0ea5e9",
          "success": "#22c55e",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
        black: {
          "color-scheme": "dark",
          "primary": "#f8fafc",
          "secondary": "#d946ef",
          "accent": "#0ea5e9",
          "neutral": "#27272a",
          "base-100": "#000000",
          "base-200": "#09090b",
          "base-300": "#18181b",
          "base-content": "#ffffff",
          "info": "#3b82f6",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        }
      },
      'dracula',
      'synthwave',
      'cupcake'
    ],
  },
}
