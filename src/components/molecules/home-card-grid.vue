<script setup lang="ts">
import type { LucideIcon } from 'lucide-vue-next'
import {
  Database,
  Eye,
  FileText,
  ImageDown,
  KeyRound,
  ListChecks,
  RefreshCw,
  Sparkles,
  Terminal,
  UploadCloud,
} from 'lucide-vue-next'

interface Feature {
  icon: LucideIcon
  name: string
  detail: string
}

interface Group {
  label: string
  description: string
  items: Feature[]
}

const groups: Group[] = [
  {
    label: 'Input',
    description: 'Get images in',
    items: [
      {
        icon: UploadCloud,
        name: 'Batch upload',
        detail: 'Drop one or many images. PNG, JPG, WebP.',
      },
    ],
  },
  {
    label: 'Processing',
    description: 'Done in the browser',
    items: [
      {
        icon: ImageDown,
        name: 'Smart optimization',
        detail: 'Resize, grayscale, re-encode. Cut payload, keep signal.',
      },
      {
        icon: Sparkles,
        name: '5 Gemini models',
        detail: 'Flash Lite, Flash, 3.5 Flash, Pro Preview, Gemma 4.',
      },
      {
        icon: Terminal,
        name: 'Custom system prompt',
        detail: 'Rewrite the OCR rules to match your workflow.',
      },
    ],
  },
  {
    label: 'Output',
    description: 'Ready to use',
    items: [
      {
        icon: ListChecks,
        name: 'Markdown list',
        detail: 'Sanitized HTML, copy with one click.',
      },
      {
        icon: RefreshCw,
        name: 'Per-image retry',
        detail: 'Re-run individual failures without restarting.',
      },
      {
        icon: Eye,
        name: 'Preview modal',
        detail: 'Inspect the source image full-size before reading.',
      },
    ],
  },
  {
    label: 'Storage',
    description: 'Stays local',
    items: [
      {
        icon: KeyRound,
        name: 'Encrypted API key',
        detail: 'AES-encrypted in IndexedDB. Never logged.',
      },
      {
        icon: Database,
        name: 'Local history',
        detail: 'Every run saved with thumbnail, model, duration.',
      },
      {
        icon: FileText,
        name: 'Zero tracking',
        detail: 'No analytics, no third-party scripts, no telemetry.',
      },
    ],
  },
]
</script>

<template>
  <section class="space-y-10">
    <div class="flex items-baseline justify-between gap-4 border-b border-border pb-3">
      <h2 class="text-sm font-mono uppercase tracking-wider text-muted-foreground">
        What's inside
      </h2>
      <span class="font-mono text-[11px] text-muted-foreground/70">
        features
      </span>
    </div>

    <div class="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="group in groups"
        :key="group.label"
        class="space-y-4"
      >
        <div class="space-y-0.5">
          <p class="font-mono text-[11px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            {{ group.label }}
          </p>
          <p class="text-xs text-muted-foreground">
            {{ group.description }}
          </p>
        </div>
        <ul class="space-y-3.5">
          <li
            v-for="item in group.items"
            :key="item.name"
            class="space-y-1"
          >
            <div class="flex items-center gap-2">
              <component
                :is="item.icon"
                class="h-3.5 w-3.5 text-foreground/80"
              />
              <span class="text-sm font-medium text-foreground">{{ item.name }}</span>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed pl-5 text-pretty">
              {{ item.detail }}
            </p>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
