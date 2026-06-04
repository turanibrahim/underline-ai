<script setup lang="ts">
import { Check, Save } from 'lucide-vue-next'
import { ref, watch } from 'vue'
import GeminiSettingsCard from '@/components/molecules/gemini-settings-card.vue'
import ImageOptimizationCard from '@/components/molecules/image-optimization-card.vue'
import { Button } from '@/components/ui/button'
import { AVAILABLE_MODELS, useGeminiStore } from '@/stores/gemini-store'
import { useOptimizerStore } from '@/stores/optimizer-store'

const geminiStore = useGeminiStore()
const optimizerStore = useOptimizerStore()

const apiKeyInput = ref<string>(geminiStore.decryptedApiKey)
const modelInput = ref<string>(geminiStore.selectedModel)
const promptInput = ref<string>(geminiStore.systemPrompt)
const maxDimensionInput = ref(optimizerStore.maxDimension)
const qualityPercentInput = ref(optimizerStore.qualityPercent)
const grayscaleInput = ref<boolean>(optimizerStore.grayscale)
const formatInput = ref(optimizerStore.format)

const saved = ref(false)

watch(
  [apiKeyInput, modelInput, promptInput, maxDimensionInput, qualityPercentInput, grayscaleInput, formatInput],
  () => {
    saved.value = false
  },
)

const handleSave = (): void => {
  if (apiKeyInput.value.trim())
    geminiStore.setApiKey(apiKeyInput.value.trim())
  if (modelInput.value)
    geminiStore.setModel(modelInput.value)
  geminiStore.setSystemPrompt(promptInput.value)

  optimizerStore.setMaxDimension(maxDimensionInput.value)
  optimizerStore.setQuality(qualityPercentInput.value)
  optimizerStore.setGrayscale(grayscaleInput.value)
  optimizerStore.setFormat(formatInput.value)

  saved.value = true
}
</script>

<template>
  <div class="space-y-6">
    <GeminiSettingsCard
      v-model:api-key="apiKeyInput"
      v-model:model="modelInput"
      v-model:prompt="promptInput"
      :models="AVAILABLE_MODELS"
    />

    <ImageOptimizationCard
      v-model:max-dimension="maxDimensionInput"
      v-model:quality-percent="qualityPercentInput"
      v-model:grayscale="grayscaleInput"
      v-model:format="formatInput"
    />

    <div
      class="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 bg-card/85 px-4 py-3 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/70"
    >
      <p class="text-xs text-muted-foreground">
        Changes are kept locally until you save.
      </p>
      <div class="flex items-center gap-3">
        <span
          class="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 transition-opacity duration-200"
          :class="saved ? 'opacity-100' : 'opacity-0'"
        >
          <Check class="h-3.5 w-3.5" />
          Saved.
        </span>
        <Button
          :disabled="!apiKeyInput.trim()"
          class="gap-1.5"
          @click="handleSave"
        >
          <Save class="h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  </div>
</template>
