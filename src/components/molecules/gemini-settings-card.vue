<script setup lang="ts">
import { Eye, EyeOff, KeyRound, Sparkles, Terminal } from 'lucide-vue-next'
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
      <CardTitle class="flex items-center gap-2">
        <span
          class="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400"
        >
          <Sparkles class="h-3.5 w-3.5" />
        </span>
        Gemini Configuration
      </CardTitle>
      <CardDescription>
        Configure your Google Gemini API key, model, and extraction prompt.
        All values are stored locally in your browser.
      </CardDescription>
    </CardHeader>
    <CardContent class="space-y-6">
      <div class="space-y-2">
        <label
          for="gemini-api-key"
          class="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
        >
          <KeyRound class="h-3 w-3" />
          Google Gemini API Key
        </label>
        <div class="relative">
          <Input
            id="gemini-api-key"
            v-model="apiKey"
            :type="showKey ? 'text' : 'password'"
            placeholder="AIzaSy..."
            class="font-mono pr-10"
            autocomplete="off"
            spellcheck="false"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            class="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            :aria-label="showKey ? 'Hide API key' : 'Show API key'"
            @click="showKey = !showKey"
          >
            <EyeOff
              v-if="showKey"
              class="h-4 w-4 text-muted-foreground"
            />
            <Eye
              v-else
              class="h-4 w-4 text-muted-foreground"
            />
          </Button>
        </div>
        <p class="text-xs text-muted-foreground">
          Your key is stored securely in your browser and never sent to our
          servers.
        </p>
      </div>

      <div class="space-y-2">
        <label
          for="gemini-model"
          class="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
        >
          Model
        </label>
        <Select
          id="gemini-model"
          v-model="model"
        >
          <SelectTrigger class="w-full sm:w-auto">
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
          for="gemini-prompt"
          class="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider"
        >
          <Terminal class="h-3 w-3" />
          System Prompt
        </label>
        <Textarea
          id="gemini-prompt"
          v-model="prompt"
          :rows="10"
          class="font-mono text-sm leading-relaxed"
          placeholder="Describe how the model should process the images…"
        />
        <p class="text-xs text-muted-foreground">
          Sent to Gemini on every extraction. Be specific about the desired
          output format.
        </p>
      </div>
    </CardContent>
  </Card>
</template>
