import type { Component } from 'vue'
import type { RouteRecordRaw } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    layout?: 'app' | 'empty'
  }
}

const lazyView = (loader: () => Promise<{ default: Component }>): (() => Promise<Component>) => {
  return async () => {
    const mod = await loader()
    return mod.default
  }
}

const homeLoader = async (): Promise<{ default: Component }> => {
  return import('../../pages/home-page.vue') as Promise<{ default: Component }>
}

const operationLoader = async (): Promise<{ default: Component }> => {
  return import('../../pages/operation-page.vue') as Promise<{ default: Component }>
}

const historyLoader = async (): Promise<{ default: Component }> => {
  return import('../../pages/history-page.vue') as Promise<{ default: Component }>
}

const settingsLoader = async (): Promise<{ default: Component }> => {
  return import('../../pages/settings-page.vue') as Promise<{ default: Component }>
}

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home-page',
    component: lazyView(homeLoader),
    meta: { layout: 'empty' },
  },
  {
    path: '/operation',
    name: 'operation-page',
    component: lazyView(operationLoader),
    meta: { layout: 'app' },
  },
  {
    path: '/history',
    name: 'history-page',
    component: lazyView(historyLoader),
    meta: { layout: 'app' },
  },
  {
    path: '/settings',
    name: 'settings-page',
    component: lazyView(settingsLoader),
    meta: { layout: 'app' },
  },
]
