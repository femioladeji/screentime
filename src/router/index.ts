import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomePage.vue'
import AppListView from '../views/AppList.vue'
import AdvancedView from '../views/AdvancedAppPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeView,
    },
    {
      path: '/app',
      component: AppListView,
    },
    {
      path: '/advanced/:name',
      component: AdvancedView,
    },
  ],
})

export default router
