import { db } from '@/resources/db'

const KEY = {
  encryptedKey: 'gemini.encryptedKey',
  model: 'gemini.model',
  systemPrompt: 'gemini.systemPrompt',
  maxDimension: 'optimizer.maxDimension',
  quality: 'optimizer.quality',
  grayscale: 'optimizer.grayscale',
  format: 'optimizer.format',
} as const

class ConfigService {
  public async get(key: string): Promise<unknown> {
    const record = await db.config.get(key)
    return record?.value
  }

  public async set(key: string, value: unknown): Promise<void> {
    await db.config.put({ key, value })
  }

  public async getEncryptedKey(): Promise<string> {
    const v = await this.get(KEY.encryptedKey)
    return typeof v === 'string' ? v : ''
  }

  public async setEncryptedKey(value: string): Promise<void> {
    await this.set(KEY.encryptedKey, value)
  }

  public async getModel(): Promise<string | undefined> {
    const v = await this.get(KEY.model)
    return typeof v === 'string' ? v : undefined
  }

  public async setModel(value: string): Promise<void> {
    await this.set(KEY.model, value)
  }

  public async getSystemPrompt(): Promise<string | undefined> {
    const v = await this.get(KEY.systemPrompt)
    return typeof v === 'string' ? v : undefined
  }

  public async setSystemPrompt(value: string): Promise<void> {
    await this.set(KEY.systemPrompt, value)
  }

  public async getMaxDimension(): Promise<number | undefined> {
    const v = await this.get(KEY.maxDimension)
    return typeof v === 'number' ? v : undefined
  }

  public async setMaxDimension(value: number): Promise<void> {
    await this.set(KEY.maxDimension, value)
  }

  public async getQuality(): Promise<number | undefined> {
    const v = await this.get(KEY.quality)
    return typeof v === 'number' ? v : undefined
  }

  public async setQuality(value: number): Promise<void> {
    await this.set(KEY.quality, value)
  }

  public async getGrayscale(): Promise<boolean | undefined> {
    const v = await this.get(KEY.grayscale)
    return typeof v === 'boolean' ? v : undefined
  }

  public async setGrayscale(value: boolean): Promise<void> {
    await this.set(KEY.grayscale, value)
  }

  public async getFormat(): Promise<'jpeg' | 'webp' | undefined> {
    const v = await this.get(KEY.format)
    return v === 'jpeg' || v === 'webp' ? v : undefined
  }

  public async setFormat(value: 'jpeg' | 'webp'): Promise<void> {
    await this.set(KEY.format, value)
  }
}

export const configService = new ConfigService()
