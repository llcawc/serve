// gulpfile.js

import { join } from 'path'
import { cwd } from 'process'

import { dest, src, watch } from 'gulp'
import { build, createServer, preview } from 'vite'

import { server } from './server/server.js'
import defineConfig from './vite.config.js'

// vserve
async function serve() {
  await server({
    port: 8080, // server port number (default: 3000)
    dist: 'dist', // folder for serve files (default: dist)
    host: true, // listen on all addresses, including LAN and public addresses
  })
}

// vite development
async function viteDev() {
  const server = await createServer(defineConfig)
  await server.listen()

  server.printUrls()
  server.bindCLIShortcuts({ print: true })
}

// vite build
async function viteBuild() {
  await build(defineConfig)
}

// vite preview
async function viteServe() {
  const dist = join(cwd(), 'dist')
  const previewServer = await preview({
    // any valid user config options, plus `mode` and `configFile`
    mode: 'development',
    build: {
      outDir: dist,
    },
    preview: {
      port: 3000,
      open: false,
      host: true,
    },
  })
  // Root log
  console.log('  ➜  Root:   ', dist)
  previewServer.printUrls()
  previewServer.bindCLIShortcuts({ print: true })
}

function copy() {
  return src('src/vendor/*').pipe(dest('dist/vendor'))
}

function watcher() {
  watch('src/**/*', viteBuild)
}

export { copy, serve, viteBuild, viteDev, viteServe, watcher }
