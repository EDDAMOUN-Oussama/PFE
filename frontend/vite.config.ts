import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Derive the Apache path from this checkout under WAMP's www directory.
  const checkout = path.dirname(__dirname).replace(/\\/g, '/').split('/www/')[1] || 'pfe';
  const proxy = { '/api': { target: env.BACKEND_ORIGIN || 'http://localhost', changeOrigin: true,
    rewrite: (url: string) => url.replace(/^\/api/, env.BACKEND_PATH || `/${checkout}/backend/controllers`) } };
  return ({
  server: {
    host: "::",
    port: 8080,
    strictPort: true,
    proxy,
  },
  preview: { port: 8080, strictPort: true, proxy },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
});
