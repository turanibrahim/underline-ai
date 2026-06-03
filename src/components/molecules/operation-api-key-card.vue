<script setup lang="ts">
import { ChevronDown, ChevronUp, Key } from 'lucide-vue-next'
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'

const emit = defineEmits(['click:save'])
const tokenInput = defineModel<string>('apiKey', {
  type: String,
  required: true,
})

const openModel = ref(false)

function init() {
  if (!tokenInput.value) {
    openModel.value = true
  }
}
init()

function handleSave() {
  emit('click:save')
}
</script>

<template>
  <Card class="overflow-hidden border-muted">
    <Collapsible v-model:open="openModel">
      <CollapsibleTrigger as-child>
        <div
          class="flex w-full items-center justify-between p-4 cursor-pointer transition-colors select-none"
        >
          <div class="flex items-center gap-3">
            <Key class="h-5 w-5 text-muted-foreground" />
            <h2 class="font-medium text-sm">
              {{ apiKey ? "API Key Configured" : "Configure API Key" }}
            </h2>
          </div>
          <div class="text-muted-foreground">
            <ChevronUp
              v-if="openModel"
              class="h-5 w-5 transition-all"
            />
            <ChevronDown
              v-else
              class="h-5 w-5 transition-all"
            />
          </div>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent
        class="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down"
      >
        <div class="p-4 border-t border-muted bg-card">
          <div class="flex gap-4 items-end">
            <div class="flex-1 space-y-2">
              <label
                class="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              >
                Google Gemini API Key
              </label>
              <Input
                v-model="tokenInput"
                type="password"
                placeholder="AIzaSy..."
                class="font-mono"
              />
            </div>
            <Button :disabled="!tokenInput" @click.stop="handleSave">
              Save Key
            </Button>
          </div>
          <p class="text-xs text-muted-foreground mt-3">
            Your key is stored securely in your browser's local storage and
            never sent to our servers.
          </p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  </Card>
</template>
