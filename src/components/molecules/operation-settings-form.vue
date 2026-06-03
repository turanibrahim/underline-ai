<script setup lang="ts">
import { Eye, EyeOff, Save } from 'lucide-vue-next'
import { ref, watch } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { AVAILABLE_MODELS, useGeminiStore } from '@/stores/gemini-store'

const geminiStore = useGeminiStore()

const apiKeyInput = ref(geminiStore.decryptedApiKey)
const modelInput = ref(geminiStore.selectedModel)
const promptInput = ref(geminiStore.systemPrompt)
const showKey = ref(false)
const saved = ref(false)

watch(apiKeyInput, () => {
  saved.value = false
})
watch(modelInput, () => {
  saved.value = false
})
watch(promptInput, () => {
  saved.value = false
})

function handleSave() {
  if (apiKeyInput.value.trim()) {
    geminiStore.setApiKey(apiKeyInput.value.trim())
  }
  if (modelInput.value) {
    geminiStore.setModel(modelInput.value)
  }
  geminiStore.setSystemPrompt(promptInput.value)
  saved.value = true
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Settings</CardTitle>
      <CardDescription>
        Configure your Google Gemini API key, model, and extraction prompt.
        All values are stored locally in your browser.
      </CardDescription>
    </CardHeader>
    <CardContent class="space-y-6">
      <div class="space-y-2">
        <label
          class="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
        >
          Google Gemini API Key
        </label>
        <div class="relative">
          <Input
            v-model="apiKeyInput"
            :type="showKey ? 'text' : 'password'"
            placeholder="AIzaSy..."
            class="font-mono pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            class="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            @click="showKey = !showKey"
          >
            <EyeOff v-if="showKey" class="h-4 w-4 text-muted-foreground" />
            <Eye v-else class="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
        <p class="text-xs text-muted-foreground">
          Your key is stored securely in your browser's local storage and never
          sent to our servers.
        </p>
      </div>

      <div class="space-y-2">
        <label
          class="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
        >
          Model
        </label>
        <Select v-model="modelInput">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="m in AVAILABLE_MODELS"
              :key="m.value"
              :value="m.value"
            >
              {{ m.label }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="space-y-2">
        <label
          class="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
        >
          System Prompt
        </label>
        <Textarea
          v-model="promptInput"
          :rows="10"
          class="font-mono text-sm"
          placeholder="Describe how the model should process the images…"
        />
      </div>

      <div class="flex items-center gap-3">
        <Button
          :disabled="!apiKeyInput.trim()"
          @click="handleSave"
        >
          <Save class="h-4 w-4 mr-2" />
          Save Settings
        </Button>
        <span v-if="saved" class="text-sm text-emerald-600 dark:text-emerald-400">
          Saved.
        </span>
      </div>
    </CardContent>
  </Card>
</template>
