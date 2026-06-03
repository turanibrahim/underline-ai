<script setup lang="ts">
import { ArrowRight, Terminal } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
</script>

<template>
  <section class="text-center max-w-3xl mx-auto space-y-6">
    <Badge
      variant="outline"
      class="gap-1.5 px-3 py-1 text-xs font-mono text-muted-foreground"
    >
      <Terminal class="h-3.5 w-3.5 text-emerald-500" />
      v1.0.0 // Client-Side Architecture
    </Badge>

    <h1
      class="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl"
    >
      Isolate and extract underlined text instantly.
    </h1>

    <p class="text-base sm:text-lg leading-7 text-muted-foreground">
      A minimalist utility designed to strip away noise from images, document
      logs, or canvas mockups. Paste your Gemini API key and parse files
      entirely within your own browser sandbox.
    </p>

    <div class="pt-4">
      <router-link :to="{ name: 'operation-page' }">
        <Button
          as="a"
          class="gap-2 text-base font-semibold px-8"
          :to="{ name: 'operation-page' }"
          size="lg"
        >
          Lets Get Started
          <ArrowRight class="h-4 w-4" />
        </Button>
      </router-link>
    </div>
  </section>
</template>
