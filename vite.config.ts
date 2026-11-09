/*
Author: -REPLACE WITH YOUR NAME-
OS support: -REPLACE WITH YOUR OS SUPPORT-
Description: Vite configuration for React and Tailwind CSS application
*/
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, '.'),
      },
    },
    optimizeDeps: {
      entries: ['src/main.jsx'],
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      allowedHosts: true as const,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch:
        process.env.DISABLE_HMR === 'true'
          ? null
          : {
              ignored: ['**/public/**', '**/.aistudio/**', '**/.playwright-cli/**', '**/*.zip'],
            },
    },
  };
});
/* --- End of vite.config.ts --- */
