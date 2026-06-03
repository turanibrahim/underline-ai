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

const STORAGE_KEY_MAX_DIM = 'optimizer.maxDimension'
const STORAGE_KEY_QUALITY = 'optimizer.quality'
const STORAGE_KEY_GRAYSCALE = 'optimizer.grayscale'
const STORAGE_KEY_FORMAT = 'optimizer.format'

function readNumber<T extends number>(key: string, fallback: T, allowed: readonly T[]): T {
  const raw = localStorage.getItem(key)
  if (raw === null || raw === '')
    return fallback
  const n = Number(raw)
  return allowed.includes(n as T) ? (n as T) : fallback
}

function readBoolean(key: string, fallback: boolean): boolean {
  const raw = localStorage.getItem(key)
  if (raw === null)
    return fallback
  return raw === 'true'
}

function readFormat(): FormatChoice {
  const raw = localStorage.getItem(STORAGE_KEY_FORMAT)
  return raw === 'webp' ? 'webp' : 'jpeg'
}

export const useOptimizerStore = defineStore('optimizer', () => {
  const maxDimension = ref<MaxDimensionChoice>(
    readNumber(STORAGE_KEY_MAX_DIM, DEFAULT_MAX_DIMENSION, MAX_DIMENSION_CHOICES),
  )
  const qualityPercent = ref<QualityPercentChoice>(
    readNumber(STORAGE_KEY_QUALITY, DEFAULT_QUALITY_PERCENT, QUALITY_PERCENT_CHOICES),
  )
  const quality = ref<number>(qualityPercent.value / 100)
  const grayscale = ref<boolean>(readBoolean(STORAGE_KEY_GRAYSCALE, DEFAULT_GRAYSCALE))
  const format = ref<FormatChoice>(readFormat())

  function asOptions(): ResolvedOptions {
    return {
      maxDimension: maxDimension.value,
      quality: quality.value,
      grayscale: grayscale.value,
      format: format.value,
    }
  }

  function setMaxDimension(v: MaxDimensionChoice): void {
    if (MAX_DIMENSION_CHOICES.includes(v)) {
      maxDimension.value = v
      localStorage.setItem(STORAGE_KEY_MAX_DIM, String(v))
    }
  }

  function setQuality(percent: number): void {
    const rounded = Math.round(percent)
    const snapped: QualityPercentChoice = QUALITY_PERCENT_CHOICES.reduce((prev, curr) =>
      Math.abs(curr - rounded) < Math.abs(prev - rounded) ? curr : prev,
    )
    qualityPercent.value = snapped
    quality.value = snapped / 100
    localStorage.setItem(STORAGE_KEY_QUALITY, String(snapped))
  }

  function setGrayscale(v: boolean): void {
    grayscale.value = v
    localStorage.setItem(STORAGE_KEY_GRAYSCALE, String(v))
  }

  function setFormat(v: FormatChoice): void {
    if (FORMAT_CHOICES.includes(v)) {
      format.value = v
      localStorage.setItem(STORAGE_KEY_FORMAT, v)
    }
  }

  return {
    maxDimension,
    qualityPercent,
    quality,
    grayscale,
    format,
    asOptions,
    setMaxDimension,
    setQuality,
    setGrayscale,
    setFormat,
  }
})
