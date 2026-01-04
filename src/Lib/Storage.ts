import { daysOfTheWeek, DATA_KEY, CONFIG_KEY } from './Constants'
import { allSites } from './Data'
import * as devStorage from './DevStorage'
import { type SiteConfigMap, type Timer } from './Types'

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
 * @description set up all the records for social media sites supported by default
 */
export const initialize = async (): Promise<void> => {
  const record = await getData<SiteConfigMap>(CONFIG_KEY)

  if (!Object.values(record).length) {
    save(CONFIG_KEY, allSites)
  }
}

export const update = async (host: string, seconds: number): Promise<void> => {
  const dayOfTheWeek = daysOfTheWeek[new Date().getDay()]
  let timerData = await getData<Timer>(DATA_KEY)
  if (!timerData) {
    timerData = {} as Timer
  }
  if (!timerData[dayOfTheWeek!]) {
    timerData[dayOfTheWeek!] = {}
  }
  if (!timerData[dayOfTheWeek!][host]) {
    timerData[dayOfTheWeek!][host] = 0
  }
  timerData[dayOfTheWeek!][host]! += seconds
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
