import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './Views/HomePage.vue'
import AppList from './Views/AppList.vue'
import AdvancedAppPage from './Views/AdvancedAppPage.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
