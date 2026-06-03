import type { OptimizerOptions } from '@/lib/image-utils'
import imageCompression from 'browser-image-compression'
import {
  calculateTargetSize,
  createCanvas,
  getCanvasContext,
  resolveOptions,
} from '@/lib/image-utils'

export interface OptimizedImage {
  file: File
  originalSize: number
  optimizedSize: number
  savedPercent: number
  width: number
  height: number
}

class ImageOptimizerService {
  public async optimize(file: File, opts?: OptimizerOptions): Promise<OptimizedImage> {
    const { maxDimension, quality, grayscale, format } = resolveOptions(opts)
    const originalSize = file.size
    const mime: string = format === 'webp' ? 'image/webp' : 'image/jpeg'

    const [image] = await imageCompression.drawFileInCanvas(file, { fileType: mime })
    const target = calculateTargetSize(image.width, image.height, maxDimension)

    const canvas = createCanvas(target.w, target.h)
    const ctx = getCanvasContext(canvas)

    ctx.filter = grayscale ? 'grayscale(100%) contrast(1.15)' : 'contrast(1.15)'
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(image, 0, 0, target.w, target.h)
    ctx.filter = 'none'

    if ('close' in image && typeof (image).close === 'function')
      (image).close()

    const ext = format === 'webp' ? 'webp' : 'jpg'
    const baseName = file.name.replace(/\.[^.]+$/, '')
    const newName = `${baseName}-opt.${ext}`

    const optimizedFile = await imageCompression.canvasToFile(
      canvas,
      mime,
      newName,
      file.lastModified,
      quality,
    )

    return {
      file: optimizedFile,
      originalSize,
      optimizedSize: optimizedFile.size,
      savedPercent: Math.max(0, Math.round((1 - optimizedFile.size / originalSize) * 100)),
      width: target.w,
      height: target.h,
    }
  }

  public async optimizeMany(files: File[], opts?: OptimizerOptions): Promise<OptimizedImage[]> {
    return Promise.all(files.map(async f => this.optimize(f, opts)))
  }
}

export const imageOptimizerService = new ImageOptimizerService()
