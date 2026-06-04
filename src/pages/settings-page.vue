<script setup lang="ts">
import { Settings as SettingsIcon } from 'lucide-vue-next'
import PageContainer from '@/components/molecules/page-container.vue'
import PageHeader from '@/components/molecules/page-header.vue'
import OperationSettingsForm from '@/components/organisms/operation-settings-form.vue'
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
  </PageContainer>
</template>
