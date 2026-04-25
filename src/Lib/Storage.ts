import { daysOfTheWeek, DATA_KEY, CONFIG_KEY } from './Constants'
import { allSites } from './Data'
import * as devStorage from './DevStorage'
import { type SiteConfigMap, type Timer } from './Types'
import { migrateFromLocalStorage, normalizeSiteConfigKeys, normalizeTimerData } from './Migration'

const mode = import.meta.env.MODE
const storage = mode === 'development' ? devStorage : chrome.storage.sync
const defaultCache = {
  active: {}
}

/**
 * @description save in storage
 * @param {string} key - the key used in saving the record is the date
 * @param {object} value - value to save in the sync storage
 */
export const save = async (key: string, value: unknown): Promise<void> => {
  await storage.set({ [key]: value })
}

/**
 * @description get the record for the specified day or current day
 * @param {string} key - data key
 */
export const getData = async <T>(key: string): Promise<T> => {
  // @ts-ignore
  const fullData: Record<string, any> = await storage.get([key])
  return fullData[key] || {}
}

/**
 * @description set up all the records for social media sites supported by default,
 * migrate data from the old extension on first run, and normalise the timer shape.
 */
export const initialize = async (): Promise<void> => {
  // 1. Pull any existing data out of chrome.storage.local (old extension).
  //    This is a no-op once sync already has data.
  await migrateFromLocalStorage()

  // 2. Seed default sites if the config is still empty after migration.
  const record = await getData<SiteConfigMap>(CONFIG_KEY)
  if (!Object.values(record).length) {
    await save(CONFIG_KEY, allSites)
  }

  // 2b. Normalize legacy title-keyed site entries to hostname-derived keys.
  const rawSites = await getData<unknown>(CONFIG_KEY)
  const normalizedSites = normalizeSiteConfigKeys(rawSites)
  if (normalizedSites.changed) {
    await save(CONFIG_KEY, normalizedSites.data)
  }

  // 3. Normalise the timer shape in sync (handles any residual old format).
  const rawTimer = await getData<unknown>(DATA_KEY)
  const normalizedTimer = normalizeTimerData(rawTimer)
  if (JSON.stringify(rawTimer || {}) !== JSON.stringify(normalizedTimer)) {
    await save(DATA_KEY, normalizedTimer)
  }
}

export const update = async (host: string, seconds: number): Promise<void> => {
  const dayOfTheWeek = daysOfTheWeek[new Date().getDay()]
  let timerData = await getData<Timer>(DATA_KEY)
  if (!timerData) {
    timerData = {}
  }
  const currentDate = getCurrentDate()
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

export const getCurrentDate = () => {
  return new Date().toISOString().substring(0, 10)
}

export const getCacheStorage = async <T>(): Promise<T> => {
  const cache = await getData<T>('cache')
  return {
    ...defaultCache,
    ...cache
  }
}
