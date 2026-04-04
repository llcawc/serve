import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest'
import { createServer, build, preview } from 'vite'
import * as serverModule from '../server/server.js'
import * as gulp from '../gulpfile.js'

vi.mock('vite', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vite')>()
  return {
    ...actual,
    createServer: vi.fn(),
    build: vi.fn(),
    preview: vi.fn(),
  }
})

vi.mock('../vite.config.js', () => ({
  default: {
    // minimal config for testing
    root: '.',
    build: { outDir: 'dist' },
  },
}))

const mockCreateServer = vi.mocked(createServer)
const mockBuild = vi.mocked(build)
const mockPreview = vi.mocked(preview)

describe('gulpfile', () => {
  let consoleSpy: any
  let originalConsoleLog: typeof console.log

  beforeEach(() => {
    originalConsoleLog = console.log
    consoleSpy = vi.spyOn(console, 'log').mockImplementation((...args) => {
      originalConsoleLog(...args)
    })
    vi.clearAllMocks()
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  describe('serve', () => {
    it('should call server with correct parameters', async () => {
      const serverSpy = vi.spyOn(serverModule, 'server').mockResolvedValue(undefined)

      await gulp.serve()

      expect(serverSpy).toHaveBeenCalledOnce()
      expect(serverSpy).toHaveBeenCalledWith({
        port: 8080,
        dist: 'dist',
        host: true,
      })
    })
  })

  describe('viteDev', () => {
    it('should create dev server and listen', async () => {
      const mockViteServer = {
        listen: vi.fn(),
        printUrls: vi.fn(),
        bindCLIShortcuts: vi.fn(),
      }
      mockCreateServer.mockResolvedValue(mockViteServer as any)

      await gulp.viteDev()

      expect(mockCreateServer).toHaveBeenCalledOnce()
      expect(mockViteServer.listen).toHaveBeenCalledOnce()
      expect(mockViteServer.printUrls).toHaveBeenCalledOnce()
      expect(mockViteServer.bindCLIShortcuts).toHaveBeenCalledWith({ print: true })
    })
  })

  describe('viteBuild', () => {
    it('should call vite build', async () => {
      mockBuild.mockResolvedValue({} as any)

      await gulp.viteBuild()

      expect(mockBuild).toHaveBeenCalledOnce()
    })
  })

  describe('viteServe', () => {
    it('should start preview server with correct config', async () => {
      const mockPreviewServer = {
        printUrls: vi.fn(),
        bindCLIShortcuts: vi.fn(),
      }
      mockPreview.mockResolvedValue(mockPreviewServer as any)

      await gulp.viteServe()

      expect(mockPreview).toHaveBeenCalledOnce()
      const config = mockPreview.mock.calls[0][0]
      expect(config?.preview?.port).toBe(3000)
      expect(config?.preview?.host).toBe(true)
      expect(config?.build?.outDir).toContain('dist')
      expect(mockPreviewServer.printUrls).toHaveBeenCalledOnce()
      expect(mockPreviewServer.bindCLIShortcuts).toHaveBeenCalledWith({ print: true })
      expect(console.log).toHaveBeenCalledWith('  ➜  Root:   ', expect.stringContaining('dist'))
    })
  })

  describe('watcher', () => {
    it('should be a function', () => {
      expect(typeof gulp.watcher).toBe('function')
    })
  })
})
