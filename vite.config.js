import { join } from 'node:path'
import { cwd } from 'node:process'

import { defineConfig } from 'vite'
const __dirname = cwd()

export default defineConfig({
  root: join(__dirname, 'src'),
  publicDir: join(__dirname, 'public'),
  build: {
    outDir: join(__dirname, 'dist'),
    emptyOutDir: true,
    manifest: false,
    assetsInlineLimit: 0,
    modulePreload: false,
    rolldownOptions: {
      input: ['./src/index.html', './src/404.html'],
      output: {
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[name].js',
        assetFileNames: (chunkInfo) => {
          let extType = chunkInfo.names[0].split('.').pop() ?? ''
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
  server: {
    port: 8080,
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['import', 'color-functions', 'global-builtin', 'legacy-js-api', 'if-function'],
      },
    },
  },
})
