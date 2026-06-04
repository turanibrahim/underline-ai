<script setup lang="ts">
import { ArrowRight, BookOpen, Play } from 'lucide-vue-next'
import HomeHeroPreview from '@/components/molecules/home-hero-preview.vue'
import { Button } from '@/components/ui/button'
</script>

<template>
  <section class="grid gap-10 lg:gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:items-center pt-8">
    <div class="space-y-6">
      <p class="font-mono text-xs tracking-tight text-muted-foreground">
        <span class="text-emerald-600 dark:text-emerald-400">●</span>
        v1.0.0
        <span class="opacity-50">/</span>
        local-first OCR
      </p>

      <h1
        class="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground leading-[1.05] text-balance"
      >
        Pull underlined text<br>
        from any image.
      </h1>

      <p class="text-base text-muted-foreground leading-relaxed max-w-xl text-pretty">
        Drop screenshots, scans, or photos in. Underline AI resizes them for the
        model, asks Gemini to read only the underlined lines, and hands back a
        clean bulleted list &mdash; all in your browser.
      </p>

      <div class="flex flex-wrap items-center gap-2 pt-2">
        <router-link :to="{ name: 'operation-page' }">
          <Button
            size="lg"
            class="gap-2 font-medium"
            :to="{ name: 'operation-page' }"
          >
            <Play class="h-3.5 w-3.5 fill-current" />
            Start extracting
            <ArrowRight class="h-4 w-4" />
          </Button>
        </router-link>
        <router-link :to="{ name: 'settings-page' }">
          <Button
            variant="outline"
            size="lg"
            class="gap-2 font-medium"
            :to="{ name: 'settings-page' }"
          >
            <BookOpen class="h-4 w-4" />
            Configure key
          </Button>
        </router-link>
      </div>

      <ul class="flex flex-wrap items-center gap-x-5 gap-y-2 pt-4 font-mono text-xs text-muted-foreground">
        <li class="flex items-center gap-1.5">
          <span class="h-1 w-1 rounded-full bg-emerald-500" />
          No account
        </li>
        <li class="flex items-center gap-1.5">
          <span class="h-1 w-1 rounded-full bg-emerald-500" />
          No tracking
        </li>
        <li class="flex items-center gap-1.5">
          <span class="h-1 w-1 rounded-full bg-emerald-500" />
          No credit card
        </li>
      </ul>
    </div>

    <HomeHeroPreview />
  </section>
</template>
