<script setup lang="ts">
import { ImageDown, ListChecks, Sparkles, UploadCloud } from 'lucide-vue-next'

interface Step {
  icon: typeof UploadCloud
  label: string
  detail: string
}

const steps: Step[] = [
  {
    icon: UploadCloud,
    label: 'Upload',
    detail: 'Drop one or more images. PNG, JPG, WebP.',
  },
  {
    icon: ImageDown,
    label: 'Optimize',
    detail: 'Resize, grayscale, re-encode in the browser.',
  },
  {
    icon: Sparkles,
    label: 'Extract',
    detail: 'Gemini reads the image and returns a list.',
  },
  {
    icon: ListChecks,
    label: 'Review',
    detail: 'Copy, retry, or save to local history.',
  },
]
</script>

<template>
  <section class="space-y-10">
    <div class="flex items-baseline justify-between gap-4 border-b border-border pb-3">
      <h2 class="text-sm font-mono uppercase tracking-wider text-muted-foreground">
        How it works
      </h2>
      <span class="font-mono text-[11px] text-muted-foreground/70">
        01 &mdash; 04
      </span>
    </div>

    <div class="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-center">
      <div class="order-2 lg:order-1">
        <ol class="space-y-5">
          <li
            v-for="(step, i) in steps"
            :key="step.label"
            class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1"
          >
            <span class="font-mono text-xs text-muted-foreground pt-0.5 tabular-nums">
              0{{ i + 1 }}
            </span>
            <div class="flex items-baseline gap-2">
              <component
                :is="step.icon"
                class="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 translate-y-[3px]"
              />
              <span class="text-sm font-semibold text-foreground">{{ step.label }}</span>
            </div>
            <span />
            <p class="text-sm text-muted-foreground leading-relaxed text-pretty">
              {{ step.detail }}
            </p>
          </li>
        </ol>
      </div>

      <div class="order-1 lg:order-2">
        <svg
          viewBox="0 0 520 200"
          xmlns="http://www.w3.org/2000/svg"
          class="w-full h-auto"
          role="img"
          aria-label="Image to optimized image to extracted list"
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path
                d="M0,0 L10,5 L0,10 z"
                fill="currentColor"
              />
            </marker>
          </defs>

          <rect
            x="10"
            y="30"
            width="150"
            height="140"
            rx="6"
            fill="none"
            stroke="currentColor"
            stroke-width="1.25"
            class="text-border"
          />
          <text
            x="22"
            y="52"
            font-family="ui-monospace, SFMono-Regular, Menlo, monospace"
            font-size="9"
            fill="currentColor"
            class="text-muted-foreground"
          >
            notes.png
          </text>
          <line
            x1="22"
            y1="78"
            x2="100"
            y2="78"
            stroke="currentColor"
            stroke-width="1.25"
            class="text-foreground/70"
          />
          <line
            x1="22"
            y1="96"
            x2="148"
            y2="96"
            stroke="currentColor"
            stroke-width="2.5"
            class="text-emerald-500"
          />
          <line
            x1="22"
            y1="114"
            x2="120"
            y2="114"
            stroke="currentColor"
            stroke-width="1.25"
            class="text-foreground/70"
          />
          <line
            x1="22"
            y1="132"
            x2="140"
            y2="132"
            stroke="currentColor"
            stroke-width="2.5"
            class="text-emerald-500"
          />
          <line
            x1="22"
            y1="150"
            x2="110"
            y2="150"
            stroke="currentColor"
            stroke-width="1.25"
            class="text-foreground/70"
          />

          <line
            x1="165"
            y1="100"
            x2="200"
            y2="100"
            stroke="currentColor"
            stroke-width="1.5"
            class="text-muted-foreground"
            marker-end="url(#arrow)"
          />
          <text
            x="167"
            y="92"
            font-family="ui-monospace, SFMono-Regular, Menlo, monospace"
            font-size="8"
            fill="currentColor"
            class="text-muted-foreground"
          >
            2048px
          </text>
          <text
            x="167"
            y="120"
            font-family="ui-monospace, SFMono-Regular, Menlo, monospace"
            font-size="8"
            fill="currentColor"
            class="text-muted-foreground"
          >
            85% q
          </text>

          <rect
            x="205"
            y="40"
            width="110"
            height="120"
            rx="6"
            fill="none"
            stroke="currentColor"
            stroke-width="1.25"
            class="text-border"
          />
          <text
            x="215"
            y="58"
            font-family="ui-monospace, SFMono-Regular, Menlo, monospace"
            font-size="9"
            fill="currentColor"
            class="text-muted-foreground"
          >
            out.jpg
          </text>
          <g opacity="0.55">
            <line
              x1="215"
              y1="80"
              x2="305"
              y2="80"
              stroke="currentColor"
              stroke-width="1.25"
              class="text-foreground/60"
            />
            <line
              x1="215"
              y1="96"
              x2="300"
              y2="96"
              stroke="currentColor"
              stroke-width="2.5"
              class="text-emerald-500"
            />
            <line
              x1="215"
              y1="112"
              x2="295"
              y2="112"
              stroke="currentColor"
              stroke-width="1.25"
              class="text-foreground/60"
            />
            <line
              x1="215"
              y1="128"
              x2="290"
              y2="128"
              stroke="currentColor"
              stroke-width="2.5"
              class="text-emerald-500"
            />
            <line
              x1="215"
              y1="144"
              x2="285"
              y2="144"
              stroke="currentColor"
              stroke-width="1.25"
              class="text-foreground/60"
            />
          </g>

          <line
            x1="320"
            y1="100"
            x2="355"
            y2="100"
            stroke="currentColor"
            stroke-width="1.5"
            class="text-muted-foreground"
            marker-end="url(#arrow)"
          />
          <text
            x="322"
            y="92"
            font-family="ui-monospace, SFMono-Regular, Menlo, monospace"
            font-size="8"
            fill="currentColor"
            class="text-muted-foreground"
          >
            gemini
          </text>
          <text
            x="322"
            y="120"
            font-family="ui-monospace, SFMono-Regular, Menlo, monospace"
            font-size="8"
            fill="currentColor"
            class="text-muted-foreground"
          >
            ocr
          </text>

          <rect
            x="360"
            y="30"
            width="150"
            height="140"
            rx="6"
            fill="none"
            stroke="currentColor"
            stroke-width="1.25"
            class="text-border"
          />
          <text
            x="372"
            y="52"
            font-family="ui-monospace, SFMono-Regular, Menlo, monospace"
            font-size="9"
            fill="currentColor"
            class="text-muted-foreground"
          >
            result.md
          </text>
          <g>
            <circle
              cx="377"
              cy="78"
              r="2"
              fill="currentColor"
              class="text-muted-foreground"
            />
            <line
              x1="385"
              y1="78"
              x2="490"
              y2="78"
              stroke="currentColor"
              stroke-width="1.25"
              class="text-foreground/80"
            />
            <circle
              cx="377"
              cy="100"
              r="2"
              fill="currentColor"
              class="text-muted-foreground"
            />
            <line
              x1="385"
              y1="100"
              x2="480"
              y2="100"
              stroke="currentColor"
              stroke-width="1.25"
              class="text-foreground/80"
            />
            <circle
              cx="377"
              cy="122"
              r="2"
              fill="currentColor"
              class="text-muted-foreground"
            />
            <line
              x1="385"
              y1="122"
              x2="495"
              y2="122"
              stroke="currentColor"
              stroke-width="1.25"
              class="text-foreground/80"
            />
          </g>
        </svg>
      </div>
    </div>
  </section>
</template>
