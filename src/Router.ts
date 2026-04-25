import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from './views/HomePage.vue'
import AppList from './views/AppList.vue'
import AdvancedAppPage from './views/AdvancedAppPage.vue'
import SettingsPage from './views/SettingsPage.vue'
import ManageTimeUnlockPage from './views/ManageTimeUnlockPage.vue'
import { MANAGE_TIME_UNLOCK_KEY, PASSWORD_KEY } from './Lib/Constants'
import * as utils from './Lib/Utils'

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
    },
    {
      path: '/advanced-new',
      component: AdvancedAppPage
    },
    {
      path: '/settings',
      component: SettingsPage
    },
    {
      path: '/app-unlock',
      component: ManageTimeUnlockPage
    }
  ]
})

const getStoredPasswordHash = async (): Promise<string> => {
  const storedPassword = await utils.getData<unknown>(PASSWORD_KEY)
  if (typeof storedPassword !== 'string') {
    return ''
  }
  return storedPassword
}

router.beforeEach(async (to) => {
  const storedPasswordHash = await getStoredPasswordHash()
  const hasPassword = Boolean(storedPasswordHash)

  if (to.path === '/app-unlock') {
    if (!hasPassword) {
      return { path: '/app' }
    }
    return true
  }

  if (to.path !== '/app') {
    return true
  }

  if (!hasPassword) {
    return true
  }

  const unlockedPasswordHash = sessionStorage.getItem(MANAGE_TIME_UNLOCK_KEY)
  if (unlockedPasswordHash === storedPasswordHash) {
    return true
  }

  return {
    path: '/app-unlock',
    query: {
      redirect: to.fullPath
    }
  }
})
