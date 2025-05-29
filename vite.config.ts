import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env files based on the mode (development, production)
  // This will make VITE_ODOO_URL available here
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      host: "::",
      port: 8080, // Your Vite dev server port
      proxy: {
        // Define a proxy for Odoo API calls
        // We'll use a common prefix like '/odoo-api' to trigger the proxy.
        // So, in your odooService.ts, your baseUrl should become something like
        // 'http://localhost:8080/odoo-api' during development,
        // or you can make VITE_ODOO_URL itself include this prefix.
        // A simpler approach is to proxy the specific paths Odoo uses, like '/web'.
        '/web': {
          target: env.VITE_ODOO_URL, // Your actual Odoo server URL from .env
          changeOrigin: true, // Recommended for most setups
          secure: false,
          rewrite: (path) => path,// Set to true if your Odoo server uses HTTPS and has a valid certificate
          // You might need to rewrite the path if VITE_ODOO_URL already contains a path
          // or if you want to remove the proxy prefix before forwarding.
          // For /web, typically no rewrite is needed if VITE_ODOO_URL is just the base Odoo URL.
          // Example rewrite:
          // rewrite: (path) => path.replace(/^\/odoo-api/, ''),
          
          // For debugging proxy issues:
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              console.log('Sending Request to Target:', proxyReq.method, proxyReq.host, proxyReq.path);
            });
            proxy.on('proxyRes', (proxyRes, req, _res) => {
              console.log('Received Response from Target:', proxyRes.statusCode, req.url);
            });
          }
        },
        // If Odoo makes calls to other top-level paths, like /longpolling, add them too
        '/longpolling': {
          target: env.VITE_ODOO_URL,
          changeOrigin: true,
          secure: false,
        }
        // Add other Odoo specific paths if needed, e.g., /jsonrpc if you ever call it directly without /web
      },
    },
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
  };
});