import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: [
      // Necessary only for local-test.
      // This is because the dependency is written as follows:
      //   "@shwaka/simple-navbar": "file:../../"
      "react",
      "react-dom",
    ],
  },
})
