import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const portFromEnv = Number(env.VITE_PORT || process.env.VITE_PORT || 5173);

  return {
    plugins: [react()],
    build: {
      // Aponta a saída do build para a pasta public/assets do projeto PHP
      outDir: path.resolve(__dirname, '../php/public/assets'),
      rollupOptions: {
        output: {
          entryFileNames: `[name].js`,
          chunkFileNames: `[name].js`,
          assetFileNames: `[name].[ext]`
        },
      },
    },
    server: {
      port: portFromEnv,
      strictPort: true,
      hmr: {
        clientPort: portFromEnv,
      },
      origin: `http://localhost:${portFromEnv}`,
    },
  };
});