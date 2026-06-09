<script setup lang="ts">
import { Image as ImageIcon, RotateCcw } from 'lucide-vue-next'
import { ref } from 'vue'
import OperationFileUpload from '@/components/molecules/operation-file-upload.vue'
import PageContainer from '@/components/molecules/page-container.vue'
import PageHeader from '@/components/molecules/page-header.vue'
import OperationImageListItem from '@/components/organisms/operation-image-list-item.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { aiService } from '@/services/gemini-service'
import { imageOptimizerService } from '@/services/image-optimizer-service'
import { useGeminiStore } from '@/stores/gemini-store'
import { useHistoryStore } from '@/stores/history-store'
import { useOptimizerStore } from '@/stores/optimizer-store'

type ItemState = 'pending' | 'optimizing' | 'queued' | 'loading' | 'success' | 'error'
type PageState = 'idle' | 'running'

interface ImageItem {
  id: number
  file: File
  previewUrl: string
  state: ItemState
  response: string
  error?: string
  optimizedFile?: File
  originalSize?: number
  optimizedSize?: number
  savedPercent?: number
  optimizedWidth?: number
  optimizedHeight?: number
}

const geminiStore = useGeminiStore()
const optimizerStore = useOptimizerStore()
const historyStore = useHistoryStore()

const pageState = ref<PageState>('idle')
const files = ref<File[]>([])
const previewUrls = ref<string[]>([])
const items = ref<ImageItem[]>([])
let nextId = 1

const handleRemoveFile = (index: number) => {
  if (previewUrls.value[index]) {
    URL.revokeObjectURL(previewUrls.value[index])
  }
  files.value.splice(index, 1)
  previewUrls.value.splice(index, 1)
}

const ensureOptimized = async (item: ImageItem): Promise<File> => {
  if (item.optimizedFile)
    return item.optimizedFile
  const result = await imageOptimizerService.optimize(item.file, optimizerStore.asOptions())
  item.optimizedFile = result.file
  item.originalSize = result.originalSize
  item.optimizedSize = result.optimizedSize
  item.savedPercent = result.savedPercent
  item.optimizedWidth = result.width
  item.optimizedHeight = result.height
  return result.file
}

const runForItem = async (item: ImageItem) => {
  item.error = undefined
  const start = performance.now()
  try {
    item.state = 'optimizing'
    const optimized = await ensureOptimized(item)
    item.state = 'queued'
    item.response = ''
    const text = await aiService.generate(
      [optimized],
      geminiStore.selectedModel,
      (status) => {
        if (status === 'processing')
          item.state = 'loading'
      },
    )
    item.response = text
    item.state = 'success'

    void historyStore.record({
      timestamp: Date.now(),
      fileName: item.file.name,
      mimeType: item.file.type || 'application/octet-stream',
      originalSize: item.originalSize ?? item.file.size,
      optimizedSize: item.optimizedSize ?? optimized.size,
      originalBlob: item.file,
      optimizedBlob: optimized,
      model: geminiStore.selectedModel,
      systemPrompt: geminiStore.systemPrompt,
      response: text,
      status: 'success',
      durationMs: Math.max(0, Math.round(performance.now() - start)),
    })
  }
  catch (err) {
    const message = err instanceof Error ? err.message : 'Request failed.'
    item.error = message
    item.state = 'error'
  }
}

const startExtraction = async () => {
  if (!files.value.length || !geminiStore.apiKey)
    return

  items.value = files.value.map((file, index) => ({
    id: nextId++,
    file,
    previewUrl: previewUrls.value[index],
    state: 'optimizing' as ItemState,
    response: '',
  }))

  pageState.value = 'running'

  await Promise.all(
    items.value.map(item => runForItem(item)),
  )
}

const retryItem = (id: number) => {
  const item = items.value.find(i => i.id === id)
  if (item)
    runForItem(item)
}

const resetAll = () => {
  for (const url of previewUrls.value) {
    URL.revokeObjectURL(url)
  }
  files.value = []
  previewUrls.value = []
  items.value = []
  pageState.value = 'idle'
}
</script>

<template>
  <PageContainer>
    <PageHeader>
      <template #icon>
        <ImageIcon class="h-4 w-4" />
      </template>
      Operation
      <template #description>
        Upload one or more images to extract underlined text using your configured
        Gemini model. All processing happens locally in your browser.
      </template>
    </PageHeader>

    <Card v-if="pageState === 'idle'">
      <CardContent>
        <OperationFileUpload
          v-model:files="files"
          v-model:preview-urls="previewUrls"
          :api-key="geminiStore.apiKey"
          @click:extract="startExtraction"
          @click:remove-file="handleRemoveFile"
        />
      </CardContent>
    </Card>

    <div
      v-else
      class="space-y-4"
    >
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-0.5">
          <h2 class="text-lg font-semibold tracking-tight">
            Extraction Results
            <span class="text-muted-foreground font-normal">({{ items.length }})</span>
          </h2>
          <p class="text-xs text-muted-foreground">
            Review the response for each uploaded image. Failed items can be retried individually.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          class="gap-1.5"
          @click="resetAll"
        >
          <RotateCcw class="h-3.5 w-3.5" />
          Start Over
        </Button>
      </div>

      <div class="space-y-3">
        <OperationImageListItem
          v-for="item in items"
          :key="item.id"
          :file="item.file"
          :preview-url="item.previewUrl"
          :state="item.state"
          :response="item.response"
          :error="item.error"
          :original-size="item.originalSize"
          :optimized-size="item.optimizedSize"
          :saved-percent="item.savedPercent"
          :optimized-width="item.optimizedWidth"
          :optimized-height="item.optimizedHeight"
          @click:retry="retryItem(item.id)"
        />
      </div>
    </div>
  </PageContainer>
</template>
