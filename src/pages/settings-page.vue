<script setup lang="ts">
import OperationSettingsForm from '@/components/organisms/operation-settings-form.vue'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
</script>

<template>
  <div class="min-h-full bg-background p-6">
    <div class="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Configure your Gemini credentials, model, and image optimization
            options. All values are stored locally in your browser.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OperationSettingsForm />
        </CardContent>
      </Card>
    </div>
  </div>
</template>
