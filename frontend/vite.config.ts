import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Derive the Apache path from this checkout under WAMP's www directory.
  const checkout = path.dirname(__dirname).replace(/\\/g, '/').split('/www/')[1] || 'pfe';
  const remote = env.VITE_API_URL?.trim();
  const proxy = { '/api': {
    target: remote || env.BACKEND_ORIGIN || 'http://localhost',
    changeOrigin: true,
    rewrite: (url: string) => url.replace(/^\/api/, remote ? '' : (env.BACKEND_PATH || `/${checkout}/backend/controllers`)),
  } };
  return ({
  server: {
    host: "::",
    port: 8080,
    strictPort: true,
    proxy,
  },
  preview: { port: 8080, strictPort: true, proxy },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
});
