import { beforeEach, describe, expect, it, vi } from 'vitest'
import { imageOptimizerService } from './image-optimizer-service'

const { drawFileInCanvas, canvasToFile, mockCtx, mockCanvas } = vi.hoisted(() => {
  const drawFileInCanvas = vi.fn<(...args: unknown[]) => unknown>()
  const canvasToFile = vi.fn<(...args: unknown[]) => unknown>()
  const mockCtx = {
    filter: '',
    imageSmoothingEnabled: false,
    imageSmoothingQuality: 'low',
    drawImage: vi.fn(),
  }
  const mockCanvas = {} as HTMLCanvasElement
  return { drawFileInCanvas, canvasToFile, mockCtx, mockCanvas }
})

vi.mock('browser-image-compression', () => ({
  default: {
    drawFileInCanvas: (file: File, opts: { fileType: string }) => drawFileInCanvas(file, opts),
    canvasToFile: (canvas: HTMLCanvasElement, mime: string, name: string, lastModified: number, quality: number) =>
      canvasToFile(canvas, mime, name, lastModified, quality),
  },
}))

vi.mock('@/lib/image-utils', async () => {
  const actual = await vi.importActual<typeof import('@/lib/image-utils')>('@/lib/image-utils')
  return {
    ...actual,
    createCanvas: () => mockCanvas,
    getCanvasContext: () => mockCtx as unknown as CanvasRenderingContext2D,
  }
})

beforeEach(() => {
  drawFileInCanvas.mockReset()
  canvasToFile.mockReset()

  drawFileInCanvas.mockImplementation(async () => {
    const fakeImage = {
      width: 4000,
      height: 2000,
      close: vi.fn(),
    }
    return [fakeImage]
  })

  canvasToFile.mockImplementation(async (...args: unknown[]) => {
    const [_canvas, mime, name] = args as [HTMLCanvasElement, string, string]
    return new File([new Uint8Array([1, 2, 3])], name, { type: mime })
  })
})

const makeFile = (name = 'photo.png', size = 100_000) =>
  new File([new Uint8Array(size)], name, { type: 'image/png' })

describe('imageOptimizerService.optimize', () => {
  it('returns dimensions based on the source image and maxDimension', async () => {
    const out = await imageOptimizerService.optimize(makeFile())
    expect(out.width).toBe(2048)
    expect(out.height).toBe(1024)
  })

  it('uses webp mime and file extension when format is webp', async () => {
    await imageOptimizerService.optimize(makeFile('shot.png'), { format: 'webp' })
    const call = canvasToFile.mock.calls[0] as [HTMLCanvasElement, string, string, number, number]
    expect(call[1]).toBe('image/webp')
  })

  it('uses jpeg mime and jpg file extension by default', async () => {
    await imageOptimizerService.optimize(makeFile('shot.png'))
    const call = canvasToFile.mock.calls[0] as [HTMLCanvasElement, string, string, number, number]
    expect(call[1]).toBe('image/jpeg')
    expect(call[2]).toBe('shot-opt.jpg')
  })

  it('replaces the original file extension with the optimized one', async () => {
    await imageOptimizerService.optimize(makeFile('image.webp'), { format: 'webp' })
    const call = canvasToFile.mock.calls[0] as [HTMLCanvasElement, string, string, number, number]
    expect(call[2]).toBe('image-opt.webp')
  })

  it('computes savedPercent from original and optimized sizes', async () => {
    const out = await imageOptimizerService.optimize(makeFile('shot.png', 1000))
    expect(out.originalSize).toBe(1000)
    expect(out.optimizedSize).toBe(3)
    expect(out.savedPercent).toBe(100)
  })

  it('clamps savedPercent at 0 when the optimized file is larger', async () => {
    canvasToFile.mockImplementationOnce(async (...args: unknown[]) => {
      const [_canvas, mime, name] = args as [HTMLCanvasElement, string, string]
      return new File([new Uint8Array(2000)], name, { type: mime })
    })
    const out = await imageOptimizerService.optimize(makeFile('shot.png', 1000))
    expect(out.savedPercent).toBe(0)
  })

  it('closes the source image when it exposes a close method', async () => {
    const close = vi.fn()
    drawFileInCanvas.mockImplementationOnce(async () => [{ width: 100, height: 100, close }])
    await imageOptimizerService.optimize(makeFile())
    expect(close).toHaveBeenCalled()
  })
})

describe('imageOptimizerService.optimizeMany', () => {
  it('optimizes every file in the input list', async () => {
    const out = await imageOptimizerService.optimizeMany([
      makeFile('a.png'),
      makeFile('b.png'),
    ])
    expect(out).toHaveLength(2)
    expect(drawFileInCanvas).toHaveBeenCalledTimes(2)
  })
})
