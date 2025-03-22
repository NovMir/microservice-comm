import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), federation({
    name: 'auth',
    filename: 'remoteEntry.js',
    exposes: {
      './Login': './src/Login',
      './Register': './src/Register',
      './Navbar': './src/Navbar',
    },
    shared: ['react', 'react-dom', '@apollo/client', 'graphql'],
  })],
  server: {
    port: 3001,
  },
  build: {
    outDir: 'dist',
    cssCodeSplit: false,
    target: 'esnext',
    modulePreload: 'false',
    minify: 'false'
  },
})
