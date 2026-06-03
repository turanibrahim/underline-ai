<script setup lang="ts">
import type { FormatChoice, MaxDimensionChoice, QualityPercentChoice } from '@/lib/image-utils'
import { ImageDown } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
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
        <ImageDown class="h-4 w-4" />
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
          class="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
        >
          Max Dimension (px)
        </label>
        <Select
          :model-value="String(maxDimension)"
          @update:model-value="(v) => maxDimension = Number(v) as MaxDimensionChoice"
        >
          <SelectTrigger class="w-full">
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
            class="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
          >
            Quality
          </label>
          <span class="text-xs font-mono text-muted-foreground">
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
          class="w-full accent-primary"
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

      <div class="flex items-center justify-between gap-4">
        <div class="space-y-1">
          <label
            class="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
          >
            Convert to Grayscale
          </label>
          <p class="text-xs text-muted-foreground">
            Best for OCR of underlined text. Disable if your underlines are
            color-coded.
          </p>
        </div>
        <Button
          type="button"
          :variant="grayscale ? 'default' : 'outline'"
          size="sm"
          class="min-w-20"
          @click="grayscale = !grayscale"
        >
          {{ grayscale ? 'On' : 'Off' }}
        </Button>
      </div>

      <div class="space-y-2">
        <label
          class="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
        >
          Output Format
        </label>
        <Select v-model="format">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="f in FORMAT_CHOICES"
              :key="f"
              :value="f"
            >
              {{ f.toUpperCase() }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </CardContent>
  </Card>
</template>
