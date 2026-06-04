<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { useGeminiStore } from '@/stores/gemini-store'
import { useOptimizerStore } from '@/stores/optimizer-store'

const geminiStore = useGeminiStore()
const optimizerStore = useOptimizerStore()

const isReady = ref<boolean>(false)
const bootError = ref<string | null>(null)

onMounted(async () => {
  try {
    await Promise.all([geminiStore.hydrate(), optimizerStore.hydrate()])
    isReady.value = true
  }
  catch (err) {
    bootError.value = err instanceof Error ? err.message : 'Failed to initialize the app.'
    console.error('App bootstrap failed.', err)
  }
})
</script>

<template>
  <div
    v-if="!isReady && !bootError"
    class="min-h-screen flex flex-col items-center justify-center gap-3 bg-background text-muted-foreground"
  >
    <Loader2 class="h-6 w-6 animate-spin" />
    <p class="text-sm">
      Loading…
    </p>
  </div>
  <div
    v-else-if="bootError"
    class="min-h-screen flex flex-col items-center justify-center gap-3 bg-background text-destructive p-6"
  >
    <p class="text-sm font-semibold">
      Could not start the app
    </p>
    <p class="text-sm text-muted-foreground max-w-md text-center">
      {{ bootError }}
    </p>
  </div>
  <router-view v-else />
</template>
