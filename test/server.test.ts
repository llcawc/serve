import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { preview } from 'vite'
import { server } from '../source/server.js'

vi.mock('vite', () => ({
  preview: vi.fn(),
}))

vi.mock('node:path', async (importOriginal) => {
  const actual = await importOriginal<typeof import('node:path')>()
  // Create a mock that avoids recursion
  const resolveMock = vi.fn((...args: string[]) => {
    // Simulate path resolution: just join with '/' for simplicity
    return args.join('/').replace(/\/+/g, '/')
  })
  const joinMock = vi.fn((...args: string[]) => {
    return args.join('/').replace(/\/+/g, '/')
  })
  return {
    ...actual,
    resolve: resolveMock,
    join: joinMock,
  }
})

vi.mock('node:process', () => ({
  cwd: vi.fn(() => '/fake/cwd'),
}))

const mockPreview = vi.mocked(preview)

describe('server', () => {
  let consoleSpy: any
  let originalConsoleLog: typeof console.log

  beforeEach(() => {
    originalConsoleLog = console.log
    consoleSpy = vi.spyOn(console, 'log').mockImplementation((...args) => {
      originalConsoleLog(...args)
    })
    vi.clearAllMocks()
    mockPreview.mockResolvedValue({
      printUrls: vi.fn(),
      bindCLIShortcuts: vi.fn(),
    } as any)
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('should use default parameters', async () => {
    await server()

    expect(mockPreview).toHaveBeenCalledOnce()
    const config = mockPreview.mock.calls[0][0]
    expect(config?.preview?.port).toBe(3000)
    expect(config?.build?.outDir).toBe('/fake/cwd/dist')
    expect(config?.preview?.host).toBeUndefined()
  })

  it('should accept custom port', async () => {
    await server({ port: 8080 })

    const config = mockPreview.mock.calls[0][0]
    expect(config?.preview?.port).toBe(8080)
  })

  it('should accept custom dist path as relative', async () => {
    await server({ dist: 'custom-dist' })

    const config = mockPreview.mock.calls[0][0]
    expect(config?.build?.outDir).toBe('/fake/cwd/custom-dist')
  })

  it('should accept custom dist path as absolute', async () => {
    await server({ dist: '/absolute/path' })

    const config = mockPreview.mock.calls[0][0]
    expect(config?.build?.outDir).toBe('/fake/cwd/absolute/path')
  })

  it('should set host to true when host is true', async () => {
    await server({ host: true })

    const config = mockPreview.mock.calls[0][0]
    expect(config?.preview?.host).toBe(true)
  })

  it('should set host to false when host is false', async () => {
    await server({ host: false })

    const config = mockPreview.mock.calls[0][0]
    expect(config?.preview?.host).toBe(false)
  })

  it('should set host to undefined when host is undefined', async () => {
    await server({ host: undefined })

    const config = mockPreview.mock.calls[0][0]
    expect(config?.preview?.host).toBeUndefined()
  })

  it('should call printUrls and bindCLIShortcuts', async () => {
    const printUrls = vi.fn()
    const bindCLIShortcuts = vi.fn()
    mockPreview.mockResolvedValue({
      printUrls,
      bindCLIShortcuts,
    } as any)

    await server()

    expect(printUrls).toHaveBeenCalledOnce()
    expect(bindCLIShortcuts).toHaveBeenCalledWith({ print: true })
  })

  it('should log root directory', async () => {
    await server()

    expect(console.log).toHaveBeenCalledWith('  ➜  Root:   ', '/fake/cwd/dist')
  })
})
