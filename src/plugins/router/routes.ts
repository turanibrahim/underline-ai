export const routes = [
    {
      path: '/',
      name: 'home-page',
      component: () => import('../../pages/home-page.vue'),
    },
    {
      path: '/operation',
      name: 'operation-page',
      component: () => import('../../pages/operation-page.vue'),
    },
  ]