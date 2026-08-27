import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import UnoCSS from "unocss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), UnoCSS()],
});
