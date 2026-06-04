import type { Component } from 'vue'
import { createApp } from 'vue'
import App from '@/App.vue'
import { pinia } from '@/plugins/pinia'
import { router } from '@/plugins/router'
import '@/style.css'

const app = createApp(App as Component)

app.use(pinia)
app.use(router)
app.mount('#app')
