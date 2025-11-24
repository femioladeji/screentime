import { colors } from './Constants'
import * as storage from './Storage'
import { type SiteConfigMap } from './Types'

export const getData = <T>(key: string) => {
  return storage.getData<T>(key)
}

export const saveConfiguration = <T>(key: string, data: T): Promise<void> => {
  return storage.save(key, data)
}

export const getBarBackgroundColors = (siteKeys: string[], allSitesConfig: SiteConfigMap): string[] => {
  let index = -1
  return siteKeys.map((each) => {
    if (!allSitesConfig[each]?.color) {
      index = (index + 1) % colors.length
      return colors[index]!
    }
    return allSitesConfig[each].color
  })
}

export const isTabAMatch = (tabUrl: string, configuration: SiteConfigMap): boolean => {
  const allSites = Object.values(configuration).map((each) => each.url)
  const tabUrlParts = tabUrl.split('.')
  return allSites.some((each) => {
    return tabUrlParts.every((eachPart) => each.includes(eachPart))
  })
}

export const getActiveTab = (): Promise<chrome.tabs.Tab | undefined> => {
  return new Promise((resolve) => {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true
      },
      (activeTab) => {
        resolve(activeTab[0])
      }
    )
  })
}

export const end = (cacheStorage: any): void => {
  const moment = Date.now()
  const { active } = cacheStorage

  if (active.name) {
    const currentDate = new Date().toISOString().substring(0, 10)
    const startOfDayTimestamp = new Date(`${currentDate}T00:00:00`).getTime()
    const start = Math.max(startOfDayTimestamp, active.timeStamp)
    const seconds = (moment - start) / 1000

    if (!cacheStorage.data[currentDate]) {
      cacheStorage.data = {}
      cacheStorage.data[currentDate] = {}
    }

    // intentionally manipulating cache storage to keep it updated real time
    const currentlyUsedTime = cacheStorage.data[currentDate][active.name] || 0
    cacheStorage.data[currentDate][active.name] = currentlyUsedTime + seconds
    cacheStorage.active = {}
    storage.update(active.name, seconds)
  }
}

export const getName = (url: string): string => {
  try {
    const host = new URL(url).hostname
    return host.replace('www.', '').replace('.com', '')
  } catch (error) {
    return ''
  }
}

export const notify = (message: string): void => {
  const notificationObject = {
    type: chrome.notifications.TemplateType.BASIC,
    iconUrl: 'images/icon_128.png',
    title: 'SCREENTIME',
    message
  }
  chrome.notifications.create(notificationObject)
}
