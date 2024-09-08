import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  outDir: 'dist',
  vite: {
    resolve: {
      alias: {
        // Asegúrate de que no haya rutas con caracteres inválidos
        '@': '/src',
      },
    },
  },
});
