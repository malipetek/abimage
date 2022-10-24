import react from "@vitejs/plugin-react";
import "dotenv/config";

const PORT = parseInt(process.env.PORT || "8081", 10);

/**
 * @type {import('vite').UserConfig}
 */
export default {
  root: "./apps/embedded-app/",
  build: {
    outDir: "../../dist/embedded",
    rollupOptions: {
      input: "./apps/embedded-app/index.html",
    },
  },
  server: {
    base: "/app/",
    port: PORT,
    hmr: {
      protocol: "wss",
      host: "",
      port: 64999 + 1,
      clientPort: PORT,
      path: "/",
    },
    middlewareMode: true,
  },
  define: {
    "process.env.SHOPIFY_API_KEY": JSON.stringify(process.env.SHOPIFY_API_KEY),
  },
  plugins: [react()],
};
