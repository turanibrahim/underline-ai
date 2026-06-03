<script setup lang="ts">
import { Eye, EyeOff } from 'lucide-vue-next'
import { ref } from 'vue'
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

export interface GeminiModelOption {
  value: string
  label: string
}

defineProps<{
  models: readonly GeminiModelOption[]
}>()
const apiKey = defineModel<string>('apiKey', { required: true })
const model = defineModel<string>('model', { required: true })
const prompt = defineModel<string>('prompt', { required: true })

const showKey = ref(false)
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
            v-model="apiKey"
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
        <Select v-model="model">
          <SelectTrigger class="w-full">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem
              v-for="m in models"
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
          v-model="prompt"
          :rows="10"
          class="font-mono text-sm"
          placeholder="Describe how the model should process the images…"
        />
      </div>
    </CardContent>
  </Card>
</template>
