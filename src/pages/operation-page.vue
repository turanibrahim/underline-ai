<script setup lang="ts">
import { ref } from 'vue'
import OperationApiKeyCard from '@/components/molecules/operation-api-key-card.vue'
import OperationFileUpload from '@/components/molecules/operation-file-upload.vue'
import OperationProcessLoading from '@/components/molecules/operation-process-loading.vue'
import OperationProcessResult from '@/components/molecules/operation-process-result.vue'
import { aiService } from '@/services/gemini-service'
import { useGeminiStore } from '@/stores/gemini-store'

const geminiStore = useGeminiStore()

type AppState = 'idle' | 'loading' | 'result'
const currentState = ref<AppState>('idle')

const localKeyInput = ref('')

const selectedFile = ref<File | null>(null)
const imagePreviewUrl = ref<string | null>(null)
const markdownOutput = ref<string>('')

function saveApiKey() {
  if (!localKeyInput.value.trim())
    return
  geminiStore.setApiKey(localKeyInput.value.trim())
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    const file = target.files[0]
    selectedFile.value = file
    if (imagePreviewUrl.value)
      URL.revokeObjectURL(imagePreviewUrl.value)
    imagePreviewUrl.value = URL.createObjectURL(file)
  }
}

async function startExtraction() {
  if (!selectedFile.value || !geminiStore.apiKey)
    return

  currentState.value = 'loading'

  try {
    markdownOutput.value = await aiService.generate([selectedFile.value])
  }
  catch (error) {
    console.error('Extraction failed:', error)
  }
  finally {
    currentState.value = 'result'
  }
}

function resetProcess() {
  currentState.value = 'idle'
  selectedFile.value = null
  markdownOutput.value = ''
  if (imagePreviewUrl.value) {
    URL.revokeObjectURL(imagePreviewUrl.value)
    imagePreviewUrl.value = null
  }
}
</script>

<template>
  <div class="min-h-screen bg-background p-6">
    <div class="max-w-4xl mx-auto space-y-6">
      <OperationApiKeyCard
        v-model:api-key="localKeyInput"
        @click:save="saveApiKey"
      />

      <div class="mt-8 transition-all duration-300 ease-in-out">
        <div
          v-if="currentState === 'idle'"
        >
          <OperationFileUpload
            :image-preview-url="imagePreviewUrl"
            :selected-file="selectedFile"
            :api-key="geminiStore.apiKey"
            @file-select="handleFileSelect"
            @extract="startExtraction"
          />
        </div>

        <OperationProcessLoading v-else-if="currentState === 'loading'" />

        <OperationProcessResult
          v-else-if="currentState === 'result'"
          :markdown-output="markdownOutput"
          @click:reset="resetProcess"
        />
      </div>
    </div>
  </div>
</template>
