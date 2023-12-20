import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import node from "@astrojs/node";

export default defineConfig({
  output: "hybrid",
  site: "https://example.com",
  integrations: [mdx(), sitemap(), tailwind(), react()],
  server: {
    port: 8080,
  },
  adapter: node({
    mode: "standalone",
  }),
});
