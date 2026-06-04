<script setup lang="ts">
import { ArrowRight, Settings as SettingsIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'

interface Step {
  title: string
  detail: string
  code: string
  external?: boolean
}

const steps: Step[] = [
  {
    title: 'Open Google AI Studio',
    detail: 'Sign in with any Google account. No project setup, no billing.',
    code: 'aistudio.google.com/apikey',
    external: true,
  },
  {
    title: 'Create an API key',
    detail: 'Click "Create API key". Pick a new or existing project when prompted.',
    code: 'Create API key',
  },
  {
    title: 'Copy the key',
    detail: 'It starts with AIzaSy&hellip; Keep it private.',
    code: 'AIzaSy&hellip;',
  },
  {
    title: 'Paste it into Settings',
    detail: 'Stored encrypted in your browser. You can rotate or clear it any time.',
    code: 'Settings &rarr; Gemini API Key',
  },
]
</script>

<template>
  <section class="space-y-8">
    <div class="flex items-baseline justify-between gap-4 border-b border-border pb-3">
      <h2 class="text-sm font-mono uppercase tracking-wider text-muted-foreground">
        Get a Gemini API key
      </h2>
      <span class="font-mono text-[11px] text-muted-foreground/70">
        free tier · no card
      </span>
    </div>

    <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12">
      <ol class="space-y-6">
        <li
          v-for="(step, i) in steps"
          :key="step.title"
          class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5"
        >
          <span class="font-mono text-xs text-emerald-600 dark:text-emerald-400 pt-0.5 tabular-nums">
            0{{ i + 1 }}
          </span>
          <div class="space-y-1.5">
            <p class="text-sm font-semibold text-foreground">
              {{ step.title }}
            </p>
            <p
              class="text-sm text-muted-foreground leading-relaxed text-pretty"
              v-html="step.detail"
            />
            <a
              v-if="step.external"
              :href="`https://${step.code}`"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-1.5 font-mono text-xs text-foreground/90 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              <span class="border-b border-dotted border-current">{{ step.code }}</span>
              <span aria-hidden="true">↗</span>
            </a>
            <code
              v-else
              class="inline-block font-mono text-xs text-foreground/90 border-b border-dotted border-muted-foreground/50"
              v-html="step.code"
            />
          </div>
        </li>
      </ol>

      <div class="rounded-lg border border-border/80 bg-muted/30 overflow-hidden self-start">
        <div class="flex items-center gap-1.5 border-b border-border/80 bg-background px-3 py-2">
          <span class="h-2 w-2 rounded-full bg-border" />
          <span class="h-2 w-2 rounded-full bg-border" />
          <span class="h-2 w-2 rounded-full bg-border" />
          <span class="ml-2 font-mono text-[10px] text-muted-foreground tracking-tight">
            aistudio.google.com/apikey
          </span>
        </div>
        <div class="p-6 space-y-5 font-mono text-[11px] leading-relaxed text-muted-foreground">
          <div>
            <span class="text-foreground/90">Google AI Studio</span>
          </div>
          <div class="border-b border-border/60 pb-2">
            <span class="text-foreground/90">API keys</span>
            <span class="float-right text-emerald-600 dark:text-emerald-400">+ Create API key</span>
          </div>
          <div class="space-y-2">
            <div class="flex items-center justify-between gap-3 text-foreground/70">
              <span>project-default</span>
              <span class="text-emerald-600 dark:text-emerald-400">AIzaSy&hellip;jQ7c</span>
            </div>
            <div class="flex items-center justify-between gap-3 text-foreground/70">
              <span>underline-ai</span>
              <span class="text-emerald-600 dark:text-emerald-400">AIzaSy&hellip;k4Wp</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-3 pt-2">
      <p class="text-sm text-muted-foreground">
        Key handy? Drop it in and start.
      </p>
      <router-link :to="{ name: 'settings-page' }">
        <Button
          variant="outline"
          size="sm"
          class="gap-1.5 font-medium"
          :to="{ name: 'settings-page' }"
        >
          <SettingsIcon class="h-3.5 w-3.5" />
          Open settings
          <ArrowRight class="h-3.5 w-3.5" />
        </Button>
      </router-link>
    </div>
  </section>
</template>
