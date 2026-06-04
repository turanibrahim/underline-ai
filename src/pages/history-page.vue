<script setup lang="ts">
import type { HistoryEntry } from '@/services/history-service'
import { Trash2 } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import HistoryRow from '@/components/molecules/history-row.vue'
import HistoryViewDialog from '@/components/molecules/history-view-dialog.vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  <div class="min-h-screen bg-background p-6">
    <div class="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader class="flex-row items-center justify-between space-y-0">
          <div class="space-y-1">
            <CardTitle>Extraction History</CardTitle>
            <CardDescription>
              {{ historyStore.entries.length }} {{ historyStore.entries.length === 1 ? 'entry' : 'entries' }}
              stored locally in your browser.
            </CardDescription>
          </div>
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
        </CardHeader>

        <CardContent>
          <div
            v-if="historyStore.isLoading"
            class="text-sm text-muted-foreground py-12 text-center"
          >
            Loading history…
          </div>

          <div
            v-else-if="historyStore.entries.length === 0"
            class="text-sm text-muted-foreground py-12 text-center space-y-2"
          >
            <p class="text-base font-medium text-foreground">
              No extractions yet
            </p>
            <p>
              Run an operation from the Operation page to start building your history.
            </p>
            <Button
              variant="outline"
              size="sm"
              class="mt-2"
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
    </div>

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
  </div>
</template>
