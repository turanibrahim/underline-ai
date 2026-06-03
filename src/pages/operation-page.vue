<script setup lang="ts">
import { Image as ImageIcon, Settings as SettingsIcon } from 'lucide-vue-next'
import { ref } from 'vue'
import OperationFileUpload from '@/components/molecules/operation-file-upload.vue'
import OperationImageListItem from '@/components/molecules/operation-image-list-item.vue'
import OperationSettingsForm from '@/components/molecules/operation-settings-form.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { aiService } from '@/services/gemini-service'
import { useGeminiStore } from '@/stores/gemini-store'

type ItemState = 'pending' | 'loading' | 'success' | 'error'
type PageState = 'idle' | 'running'

interface ImageItem {
  id: number
  file: File
  previewUrl: string
  state: ItemState
  response: string
  error?: string
}

const geminiStore = useGeminiStore()

const pageState = ref<PageState>('idle')
const selectedFiles = ref<File[]>([])
const previewUrls = ref<string[]>([])
const items = ref<ImageItem[]>([])
let nextId = 1

function handleRemoveFile(index: number) {
  if (previewUrls.value[index]) {
    URL.revokeObjectURL(previewUrls.value[index])
  }
  selectedFiles.value.splice(index, 1)
  previewUrls.value.splice(index, 1)
}

async function runForItem(item: ImageItem) {
  item.state = 'loading'
  item.response = ''
  item.error = undefined
  try {
    const text = await aiService.generate([item.file], geminiStore.selectedModel)
    item.response = text
    item.state = 'success'
  }
  catch (err) {
    const message = err instanceof Error ? err.message : 'Request failed.'
    item.error = message
    item.state = 'error'
  }
}

async function startExtraction() {
  if (!selectedFiles.value.length || !geminiStore.apiKey)
    return

  items.value = selectedFiles.value.map((file, index) => ({
    id: nextId++,
    file,
    previewUrl: previewUrls.value[index],
    state: 'loading' as ItemState,
    response: '',
  }))

  pageState.value = 'running'

  await Promise.all(
    items.value.map(item => runForItem(item)),
  )
}

function retryItem(id: number) {
  const item = items.value.find(i => i.id === id)
  if (item)
    runForItem(item)
}

function resetAll() {
  for (const url of previewUrls.value) {
    URL.revokeObjectURL(url)
  }
  selectedFiles.value = []
  previewUrls.value = []
  items.value = []
  pageState.value = 'idle'
}
</script>

<template>
  <div class="min-h-screen bg-background p-6">
    <div class="max-w-5xl mx-auto space-y-6">
      <Tabs default-value="operation" class="w-full">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value="operation" class="gap-2">
            <ImageIcon class="h-4 w-4" />
            Operation
          </TabsTrigger>
          <TabsTrigger value="settings" class="gap-2">
            <SettingsIcon class="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="operation" class="mt-6">
          <Card>
            <CardContent class="pt-6">
              <div
                v-if="pageState === 'idle'"
                class="transition-all duration-300 ease-in-out"
              >
                <OperationFileUpload
                  v-model:selected-files="selectedFiles"
                  v-model:preview-urls="previewUrls"
                  :api-key="geminiStore.apiKey"
                  @click:extract="startExtraction"
                  @click:remove-file="handleRemoveFile"
                />
              </div>

              <div
                v-else
                class="space-y-4 animate-in fade-in slide-in-from-bottom-4"
              >
                <div class="flex items-center justify-between border-b pb-4">
                  <h2 class="text-2xl font-bold tracking-tight">
                    Extraction Results ({{ items.length }})
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    @click="resetAll"
                  >
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
                    @click:retry="retryItem(item.id)"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" class="mt-6">
          <OperationSettingsForm />
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>
