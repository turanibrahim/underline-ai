<script setup lang="ts">
import type { FormatChoice, MaxDimensionChoice, QualityPercentChoice } from '@/lib/image-utils'
import { ImageDown, ImagePlus, Palette, Ruler } from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  FORMAT_CHOICES,
  MAX_DIMENSION_CHOICES,
  QUALITY_PERCENT_CHOICES,
} from '@/lib/image-utils'

const maxDimension = defineModel<MaxDimensionChoice>('maxDimension', { required: true })
const qualityPercent = defineModel<QualityPercentChoice>('qualityPercent', { required: true })
const grayscale = defineModel<boolean>('grayscale', { required: true })
const format = defineModel<FormatChoice>('format', { required: true })
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <span
          class="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400"
        >
          <ImageDown class="h-3.5 w-3.5" />
        </span>
        Image Optimization
      </CardTitle>
      <CardDescription>
        Images are optimized in the browser before being sent to Gemini:
        resized, optionally converted to grayscale, and re-encoded for OCR.
      </CardDescription>
    </CardHeader>
    <CardContent class="space-y-6">
      <div class="space-y-2">
        <label
          class="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
        >
          <Ruler class="h-3 w-3" />
          Max Dimension (px)
        </label>
        <Select
          :model-value="String(maxDimension)"
          @update:model-value="(v) => maxDimension = Number(v) as MaxDimensionChoice"
        >
          <SelectTrigger class="w-full sm:w-auto">
            <SelectValue placeholder="Select max dimension" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="d in MAX_DIMENSION_CHOICES"
              :key="d"
              :value="String(d)"
            >
              {{ d }} px
            </SelectItem>
          </SelectContent>
        </Select>
        <p class="text-xs text-muted-foreground">
          The longest edge is capped to this value. Images smaller than this are
          not upscaled.
        </p>
      </div>

      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <label
            class="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
          >
            <ImagePlus class="h-3 w-3" />
            Quality
          </label>
          <span class="text-xs font-mono text-emerald-600 dark:text-emerald-400">
            {{ qualityPercent }}%
          </span>
        </div>
        <input
          v-model.number="qualityPercent"
          type="range"
          :min="QUALITY_PERCENT_CHOICES[0]"
          :max="QUALITY_PERCENT_CHOICES[QUALITY_PERCENT_CHOICES.length - 1]"
          step="5"
          list="quality-stops"
          class="w-full accent-emerald-500"
        >
        <datalist id="quality-stops">
          <option
            v-for="q in QUALITY_PERCENT_CHOICES"
            :key="q"
            :value="q"
          />
        </datalist>
        <p class="text-xs text-muted-foreground">
          JPEG/WebP re-encoding quality. Higher = larger file, better fidelity.
        </p>
      </div>

      <div class="flex items-center justify-between gap-4 rounded-md border border-border/60 bg-muted/30 px-4 py-3">
        <div class="flex items-start gap-3 min-w-0">
          <span
            class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400"
          >
            <Palette class="h-3.5 w-3.5" />
          </span>
          <div class="space-y-0.5 min-w-0">
            <p class="text-sm font-medium">
              Convert to Grayscale
            </p>
            <p class="text-xs text-muted-foreground">
              Best for OCR of underlined text. Disable if your underlines are
              color-coded.
            </p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          :aria-checked="grayscale"
          class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          :class="grayscale
            ? 'bg-emerald-500'
            : 'bg-input'"
          @click="grayscale = !grayscale"
        >
          <span
            class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200"
            :class="grayscale ? 'translate-x-5' : 'translate-x-0.5'"
          />
        </button>
      </div>

      <div class="space-y-2">
        <label
          class="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
        >
          Output Format
        </label>
        <Select v-model="format">
          <SelectTrigger class="w-full sm:w-auto">
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="f in FORMAT_CHOICES"
              :key="f"
              :value="f"
            >
              <span class="font-mono">{{ f.toUpperCase() }}</span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </CardContent>
  </Card>
</template>
