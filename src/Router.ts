import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from './views/HomePage.vue'
import AppList from './views/AppList.vue'
import AdvancedAppPage from './views/AdvancedAppPage.vue'

export const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomePage
    },
    {
      path: '/app',
      component: AppList
    },
    {
      path: '/advanced/:name',
      component: AdvancedAppPage
    }
  ]
})
