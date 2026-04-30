import { daysOfTheWeek, DATA_KEY, CONFIG_KEY } from './Constants'
import { allSites } from './Data'
import * as devStorage from './DevStorage'
import { type SiteConfigMap, type Timer } from './Types'
import { migrateFromLocalStorage, normalizeSiteConfigKeys, normalizeTimerData } from './Migration'

const mode = import.meta.env.MODE
const storage = mode === 'development' ? devStorage : chrome.storage.local
const defaultCache = {
  active: {}
}

export const save = async (key: string, value: unknown): Promise<void> => {
  await storage.set({ [key]: value })
}

export const getData = async <T>(key: string): Promise<T> => {
  const fullData = await storage.get([key]) as Record<string, T>
  return fullData[key] || {} as T
}

/**
 * @description set up all the records for social media sites supported by default,
 * migrate data from the old extension on first run, and normalise the timer shape.
 */
export const initialize = async (): Promise<void> => {
  await migrateFromLocalStorage()

  const record = await getData<SiteConfigMap>(CONFIG_KEY)
  if (!Object.values(record).length) {
    await save(CONFIG_KEY, allSites)
  }

  const rawSites = await getData<unknown>(CONFIG_KEY)
  const normalizedSites = normalizeSiteConfigKeys(rawSites)
  if (normalizedSites.changed) {
    await save(CONFIG_KEY, normalizedSites.data)
  }

  const rawTimer = await getData<unknown>(DATA_KEY)
  const normalizedTimer = normalizeTimerData(rawTimer)
  if (JSON.stringify(rawTimer || {}) !== JSON.stringify(normalizedTimer)) {
    await save(DATA_KEY, normalizedTimer)
  }
}

export const update = async (host: string, seconds: number, atDate: Date = new Date()): Promise<void> => {
  const dayOfTheWeek = daysOfTheWeek[atDate.getDay()]
  let timerData = await getData<Timer>(DATA_KEY)
  if (!timerData) {
    timerData = {}
  }
  const currentDate = getCurrentDate(atDate)
  const bucket = timerData[dayOfTheWeek!]
  if (!bucket || bucket.date !== currentDate) {
    timerData[dayOfTheWeek!] = { date: currentDate, usage: {} }
  } else if (!bucket.usage) {
    timerData[dayOfTheWeek!] = { ...bucket, usage: {} }
  }
  const usage = timerData[dayOfTheWeek!]!.usage
  usage[host] = (usage[host] ?? 0) + Number(seconds)
  await save(DATA_KEY, timerData)
}

export const getCurrentDate = (date: Date = new Date()) => {
  const today = date
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const getCacheStorage = async <T>(): Promise<T> => {
  const cache = await getData<T>('cache')
  return {
    ...defaultCache,
    ...cache
  }
}
