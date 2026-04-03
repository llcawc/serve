import { join, resolve } from 'path'

import { defineConfig } from 'vite'
const __dirname = resolve()

export default defineConfig({
  root: join(__dirname, 'src'),
  publicDir: join(__dirname, 'public'),
  server: {
    port: 3000,
  },
  build: {
    outDir: join(__dirname, 'dist'),
    emptyOutDir: true,
    manifest: false,
    assetsInlineLimit: 0,
    modulePreload: false,
    rollupOptions: {
      input: ['./src/index.html', './src/404.html'],
      output: {
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[name].js',
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.names[0].split('.').pop()
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'images'
          }
          if (/ttf|eot|woff2?/i.test(extType)) {
            extType = 'fonts'
          }
          return `${extType}/[name][extname]`
        },
      },
    },
  },
})
