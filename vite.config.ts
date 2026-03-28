import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  server: {
    allowedHosts: [
      'https://unsimilarly-lexicostatistical-tamie.ngrok-free.dev', // Ajoutez votre URL ngrok ici
      '*.ngrok-free.app'               // Ou utilisez un joker pour accepter tous les sous-domaines ngrok
    ]
  },
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
})
