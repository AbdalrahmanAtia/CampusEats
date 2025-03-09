import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createHtmlPlugin } from 'vite-plugin-html'; // Correct import

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), createHtmlPlugin()],
  build: {
    rollupOptions: {
      external: ['mock-aws-s3', 'aws-sdk', 'nock'], // Mark these as external
    },
  },
});
