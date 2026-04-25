import { colors, daysOfTheWeek } from './Constants'
import * as storage from './Storage'
import { type DayOfTheWeek, type SiteConfig, type SiteConfigMap, type Timer } from './Types'

export const getData = <T>(key: string) => {
  return storage.getData<T>(key)
}

export const hashPassword = async (password: string): Promise<string> => {
  const encodedPassword = new TextEncoder().encode(password)
  const hashedPasswordBuffer = await crypto.subtle.digest('SHA-256', encodedPassword)
  const hashedPasswordArray = Array.from(new Uint8Array(hashedPasswordBuffer))
  return hashedPasswordArray.map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

export const initializeStorage = () => {
  return storage.initialize()
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

export const end = async (cacheStorage: any): Promise<void> => {
  const moment = Date.now()
  const { active } = cacheStorage
  if (active.name) {
    const currentDate = new Date().toISOString().substring(0, 10);
    const dayOfTheWeek = getDayOfTheWeek();
    const startOfDayTimestamp = new Date(`${currentDate}T00:00:00`).getTime()
    const start = Math.max(startOfDayTimestamp, active.timeStamp)
    const seconds = (moment - start) / 1000

    // Update cache immediately for real-time tracking
    if (!cacheStorage.data[dayOfTheWeek] || cacheStorage.data[dayOfTheWeek].date !== currentDate) {
      cacheStorage.data[dayOfTheWeek] = {
        date: currentDate,
        usage: {}
      }
    } else if (!cacheStorage.data[dayOfTheWeek].usage) {
      cacheStorage.data[dayOfTheWeek].usage = {}
    }
    const usage = cacheStorage.data[dayOfTheWeek].usage
    usage[active.name] = (usage[active.name] || 0) + seconds

    cacheStorage.active = {}

    // Persist to storage (will trigger sync via onChanged listener)
    await storage.update(active.name, seconds)
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
    iconUrl: '/images/icon_128.png',
    title: 'SCREENTIME',
    message
  }
  chrome.notifications.create(notificationObject)
}

export const getCurrentDate = (): string => {
  return new Date().toISOString().substring(0, 10)
}

export const getDayOfTheWeek = (): DayOfTheWeek => {
  const today = new Date()
  return daysOfTheWeek[today.getDay()]!
}

const getCurrentTime = (currentDate: Date | null = null): string => {
  if (!currentDate) {
    currentDate = new Date();
  }
  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export const getSecondsToNextBlock = (config: SiteConfig): number | null => {
  const dayOfTheWeek = getDayOfTheWeek();
  if (!config || !config.days || !config.days[dayOfTheWeek]) {
    return null;
  }
  const frames = Object.values(config.days[dayOfTheWeek]);
  if (!frames?.length) {
    return null;
  }
  const currentTime = getCurrentTime();
  let leastStart: string | null = null;
  frames.forEach((each) => {
    if (currentTime < each.from) {
      if (!leastStart) {
        leastStart = each.from;
      } else if (each.from < leastStart) {
        leastStart = each.from;
      }
    }
  });
  if (!leastStart) {
    return null;
  }
  const leastStartDate = new Date();
  const leastStartParts = (leastStart as string).split(':');
  leastStartDate.setHours(Number(leastStartParts[0]), Number(leastStartParts[1]));
  return (leastStartDate.getTime() - new Date().getTime()) / 1000;
}

export const isTimeExceeded = ({ data, configuration }: {
  configuration: SiteConfigMap;
  data: Timer;
}, name: string) => {
  const currentDayBucket = data[getDayOfTheWeek()];
  if (!configuration[name]?.control || !currentDayBucket) {
    return false;
  }
  // If time limit is 0, treat as unlimited
  if (configuration[name]!.time === 0) {
    return false;
  }
  if ((currentDayBucket.usage?.[name] || 0) >= configuration[name]!.time * 60) {
    notify(`Time limit exceeded for ${name}`);
    return true;
  }
  return false;
}

export const isTimeframeBlocked = ({ configuration }: {
  configuration: SiteConfigMap;
}, name: string) => {
  const day = getDayOfTheWeek();
  if (!configuration[name]
    || !configuration[name].control
    || !configuration[name].days
    || !configuration[name].days[day]) {
    return false;
  }
  const currentTime = getCurrentTime();
  const allDaysBlocks = Object.values(configuration[name].days[day]);
  for (let i = 0; i < allDaysBlocks.length; i += 1) {
    const { from, to } = allDaysBlocks[i]!;
    if (from <= currentTime && to >= currentTime) {
      notify(`You can't use ${name} between ${from} and ${to} on ${day}`);
      return true;
    }
  }
  return false;
}
