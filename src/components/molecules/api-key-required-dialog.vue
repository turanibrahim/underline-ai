<script setup lang="ts">
import { KeyRound } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()
</script>

<template>
  <Dialog
    :open="open"
    @update:open="(v: boolean) => emit('update:open', v)"
  >
    <DialogContent>
      <DialogHeader>
        <div class="flex items-center gap-2">
          <span
            class="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400"
          >
            <KeyRound class="h-3.5 w-3.5" />
          </span>
          <DialogTitle>
            API key required
          </DialogTitle>
        </div>
        <DialogDescription>
          The Operation page needs a Google Gemini API key. Add one in
          Settings to start extracting underlined text from images.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose as-child>
          <Button>
            Got it
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
