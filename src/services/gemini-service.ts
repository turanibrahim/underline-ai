import { GoogleGenAI } from '@google/genai'
import * as CryptoJS from 'crypto-js'

const OBFUSCATION_SECRET = 'gemini-extractor-local-salt-v1'

class AIService {
  private decryptedApiKey: string = ''
  private systemPrompt: string = ''

  public encryptKey(rawKey: string): string {
    const encryptedKey = CryptoJS.AES.encrypt(rawKey, OBFUSCATION_SECRET).toString()

    return encryptedKey
  }

  public initializeKey(encryptedKey: string): void {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedKey, OBFUSCATION_SECRET)
      const decrypted = bytes.toString(CryptoJS.enc.Utf8)

      if (!decrypted) {
        throw new Error('Malformed key')
      }

      this.decryptedApiKey = decrypted
    }
    catch (error) {
      console.error('Failed to decrypt API Key. Ensure the key is valid.', error)
      this.decryptedApiKey = ''
    }
  }

  public setSystemPrompt(prompt: string): void {
    this.systemPrompt = prompt
  }

  public getDecryptedKey(): string {
    return this.decryptedApiKey
  }

  private async fileToGenerativePart(file: File): Promise<{ inlineData: { data: string, mimeType: string } }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(',')[1]
        resolve({
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        })
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  public async generate(images: File[], model: string): Promise<string> {
    if (!this.decryptedApiKey) {
      return Promise.reject(new Error('API Key is missing. Please initialize the service.'))
    }

    if (images.length === 0) {
      return Promise.reject(new Error('No image files provided.'))
    }

    if (!model) {
      return Promise.reject(new Error('Model is not selected.'))
    }

    try {
      const ai = new GoogleGenAI({ apiKey: this.decryptedApiKey })
      const imageParts = await Promise.all(images.map(async img => this.fileToGenerativePart(img)))

      const contents = [
        {
          role: 'user',
          parts: [
            ...(this.systemPrompt ? [{ text: this.systemPrompt }] : []),
            ...imageParts,
          ],
        },
      ]

      const response = await ai.models.generateContent({
        model,
        contents,
      })

      return response?.text ?? ''
    }
    catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred during extraction.'
      return Promise.reject(new Error(message))
    }
  }
}

export const aiService = new AIService()
