import type {
  FormatChoice,
  MaxDimensionChoice,
  QualityPercentChoice,
  ResolvedOptions,
} from '@/lib/image-utils'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  DEFAULT_GRAYSCALE,
  DEFAULT_MAX_DIMENSION,
  DEFAULT_QUALITY_PERCENT,
  FORMAT_CHOICES,
  MAX_DIMENSION_CHOICES,
  QUALITY_PERCENT_CHOICES,
} from '@/lib/image-utils'
import { configService } from '@/services/config-service'

const readNumber = <T extends number>(value: unknown, fallback: T, allowed: readonly T[]): T => {
  if (typeof value !== 'number' || !Number.isFinite(value))
    return fallback
  return allowed.includes(value as T) ? (value as T) : fallback
}

const readBoolean = (value: unknown, fallback: boolean): boolean => {
  if (typeof value !== 'boolean')
    return fallback
  return value
}

const readFormat = (value: unknown): FormatChoice => {
  return value === 'webp' ? 'webp' : 'jpeg'
}

export const useOptimizerStore = defineStore('optimizer', () => {
  const maxDimension = ref<MaxDimensionChoice>(DEFAULT_MAX_DIMENSION)
  const qualityPercent = ref<QualityPercentChoice>(DEFAULT_QUALITY_PERCENT)
  const quality = ref<number>(qualityPercent.value / 100)
  const grayscale = ref<boolean>(DEFAULT_GRAYSCALE)
  const format = ref<FormatChoice>(readFormat(undefined))
  const isReady = ref<boolean>(false)

  const hydrate = async (): Promise<void> => {
    const [storedMaxDim, storedQuality, storedGrayscale, storedFormat] = await Promise.all([
      configService.getMaxDimension(),
      configService.getQuality(),
      configService.getGrayscale(),
      configService.getFormat(),
    ])

    maxDimension.value = readNumber(storedMaxDim, DEFAULT_MAX_DIMENSION, MAX_DIMENSION_CHOICES)
    qualityPercent.value = readNumber(storedQuality, DEFAULT_QUALITY_PERCENT, QUALITY_PERCENT_CHOICES)
    quality.value = qualityPercent.value / 100
    grayscale.value = readBoolean(storedGrayscale, DEFAULT_GRAYSCALE)
    format.value = readFormat(storedFormat)
    isReady.value = true
  }

  const asOptions = (): ResolvedOptions => {
    return {
      maxDimension: maxDimension.value,
      quality: quality.value,
      grayscale: grayscale.value,
      format: format.value,
    }
  }

  const setMaxDimension = async (v: MaxDimensionChoice): Promise<void> => {
    if (!MAX_DIMENSION_CHOICES.includes(v))
      return
    maxDimension.value = v
    await configService.setMaxDimension(v)
  }

  const setQuality = async (percent: number): Promise<void> => {
    const rounded = Math.round(percent)
    const snapped: QualityPercentChoice = QUALITY_PERCENT_CHOICES.reduce((prev, curr) =>
      Math.abs(curr - rounded) < Math.abs(prev - rounded) ? curr : prev,
    )
    qualityPercent.value = snapped
    quality.value = snapped / 100
    await configService.setQuality(snapped)
  }

  const setGrayscale = async (v: boolean): Promise<void> => {
    grayscale.value = v
    await configService.setGrayscale(v)
  }

  const setFormat = async (v: FormatChoice): Promise<void> => {
    if (!FORMAT_CHOICES.includes(v))
      return
    format.value = v
    await configService.setFormat(v)
  }

  return {
    maxDimension,
    qualityPercent,
    quality,
    grayscale,
    format,
    isReady,
    hydrate,
    asOptions,
    setMaxDimension,
    setQuality,
    setGrayscale,
    setFormat,
  }
})
