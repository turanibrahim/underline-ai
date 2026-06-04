<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { useId } from 'vue'
import { cn } from '@/lib/utils'

type LogoVariant = 'mark' | 'lockup'

const props = withDefaults(defineProps<{
  variant?: LogoVariant
  size?: number
  class?: HTMLAttributes['class']
}>(), {
  variant: 'lockup',
  size: 28,
})

const gradientId = useId()
</script>

<template>
  <span
    :class="cn('inline-flex items-center gap-2 font-sans leading-none', props.class)"
    aria-label="Underline AI"
  >
    <svg
      :width="size"
      :height="size"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          :id="gradientId"
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#34d399" />
          <stop offset="1" stop-color="#059669" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="7" :fill="`url(#${gradientId})`" />
      <rect x="7" y="9" width="13" height="3" rx="1.5" fill="#fff" opacity="0.7" />
      <rect x="7" y="15" width="18" height="3" rx="1.5" fill="#fff" opacity="0.7" />
      <rect x="7" y="20" width="18" height="3" rx="1.5" fill="#fff" />
      <rect x="7" y="25.5" width="18" height="2.5" rx="1.25" fill="#fff" />
    </svg>

    <span
      v-if="variant === 'lockup'"
      class="inline-flex items-baseline font-semibold tracking-tight text-foreground"
    >
      <span class="relative inline-block pb-[5px]">
        Underline
        <span
          aria-hidden="true"
          class="absolute left-0 right-0 bottom-0 h-[2px] rounded-full bg-emerald-500"
        />
      </span>
      <span class="ml-1.5 text-[0.78em] font-medium tracking-wide text-emerald-600 dark:text-emerald-400">
        AI
      </span>
    </span>
  </span>
</template>
