<script setup lang="ts">
import { Settings as SettingsIcon } from 'lucide-vue-next'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import ApiKeyRequiredDialog from '@/components/molecules/api-key-required-dialog.vue'
import PageContainer from '@/components/molecules/page-container.vue'
import PageHeader from '@/components/molecules/page-header.vue'
import OperationSettingsForm from '@/components/organisms/operation-settings-form.vue'

const route = useRoute()
const isApiKeyDialogOpen = ref<boolean>(route.query.reason === 'missing-api-key')
</script>

<template>
  <PageContainer>
    <PageHeader>
      <template #icon>
        <SettingsIcon class="h-4 w-4" />
      </template>
      Settings
      <template #description>
        Configure your Gemini credentials, model, and image optimization
        options. All values are stored locally in your browser.
      </template>
    </PageHeader>

    <OperationSettingsForm />

    <ApiKeyRequiredDialog v-model:open="isApiKeyDialogOpen" />
  </PageContainer>
</template>
