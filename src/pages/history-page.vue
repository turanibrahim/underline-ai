<script setup lang="ts">
import type { HistoryEntry } from '@/services/history-service'
import { History, Trash2 } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import HistoryRow from '@/components/molecules/history-row.vue'
import HistoryViewDialog from '@/components/molecules/history-view-dialog.vue'
import PageContainer from '@/components/molecules/page-container.vue'
import PageHeader from '@/components/molecules/page-header.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow as UiTableRow,
} from '@/components/ui/table'
import { useHistoryStore } from '@/stores/history-store'

const historyStore = useHistoryStore()

const viewingEntry = ref<HistoryEntry | null>(null)
const isViewOpen = ref<boolean>(false)
const isClearAllOpen = ref<boolean>(false)
const pendingDelete = ref<HistoryEntry | null>(null)

onMounted(() => {
  void historyStore.load()
})

const openView = (entry: HistoryEntry) => {
  viewingEntry.value = entry
  isViewOpen.value = true
}

const closeView = (value: boolean) => {
  isViewOpen.value = value
  if (!value)
    viewingEntry.value = null
}

const confirmDelete = (entry: HistoryEntry) => {
  pendingDelete.value = entry
}

const handleDelete = async () => {
  if (!pendingDelete.value)
    return
  const id = pendingDelete.value.id
  pendingDelete.value = null
  if (id != null)
    await historyStore.remove(id)
}

const handleClearAll = async () => {
  isClearAllOpen.value = false
  await historyStore.clearAll()
}
</script>

<template>
  <PageContainer>
    <PageHeader>
      <template #icon>
        <History class="h-4 w-4" />
      </template>
      Extraction History
      <template #description>
        {{ historyStore.entries.length }}
        {{ historyStore.entries.length === 1 ? 'entry' : 'entries' }}
        stored locally in your browser. Each row keeps the source image, optimized
        version, and the model's response.
      </template>
      <template #actions>
        <Button
          variant="outline"
          size="sm"
          :disabled="historyStore.entries.length === 0"
          class="gap-1.5 text-destructive hover:text-destructive"
          @click="isClearAllOpen = true"
        >
          <Trash2 class="h-3.5 w-3.5" />
          Clear all
        </Button>
      </template>
    </PageHeader>

    <Card>
      <CardContent class="p-0">
        <div
          v-if="historyStore.isLoading"
          class="text-sm text-muted-foreground py-16 text-center"
        >
          Loading history…
        </div>

        <div
          v-else-if="historyStore.entries.length === 0"
          class="flex flex-col items-center justify-center text-sm text-muted-foreground py-16 px-6 space-y-3"
        >
          <div
            class="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400"
          >
            <History class="h-4 w-4" />
          </div>
          <p class="text-base font-medium text-foreground">
            No extractions yet
          </p>
          <p class="text-center max-w-sm">
            Run an operation from the Operation page to start building your history.
          </p>
          <Button
            variant="outline"
            size="sm"
            class="mt-1"
            @click="$router.push('/operation')"
          >
            Go to Operation
          </Button>
        </div>

        <Table v-else>
          <TableHeader>
            <UiTableRow>
              <TableHead class="w-20">
                Preview
              </TableHead>
              <TableHead>File</TableHead>
              <TableHead>When</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Sizes / Duration</TableHead>
              <TableHead class="text-right">
                Actions
              </TableHead>
            </UiTableRow>
          </TableHeader>
          <TableBody>
            <HistoryRow
              v-for="entry in historyStore.entries"
              :key="entry.id"
              :entry="entry"
              @view="openView"
              @delete="confirmDelete"
            />
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <HistoryViewDialog
      :open="isViewOpen"
      :entry="viewingEntry"
      @update:open="closeView"
    />

    <Dialog
      :open="pendingDelete != null"
      @update:open="(v: boolean) => { if (!v) pendingDelete = null }"
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this entry?</DialogTitle>
          <DialogDescription>
            This will permanently remove
            <span class="font-medium text-foreground">{{ pendingDelete?.fileName }}</span>
            from your history. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            @click="pendingDelete = null"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            @click="handleDelete"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog
      :open="isClearAllOpen"
      @update:open="(v: boolean) => isClearAllOpen = v"
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Clear all history?</DialogTitle>
          <DialogDescription>
            This will permanently delete all
            {{ historyStore.entries.length }} history entries and their stored images.
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            @click="isClearAllOpen = false"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            @click="handleClearAll"
          >
            Clear all
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </PageContainer>
</template>
