import allSites from './data';
import devStorage from './devStorage';
import { dayOfTheWeekMap, type ConfigType, type TimerType } from './types';

const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.MODE === 'development';
const STORAGE = isDev ? devStorage : chrome.storage.sync;
const DATAKEY = 'timer';
const DEFAULT_CACHE = {
    active: {},
};

export default {
    async update(host: string, seconds: number) {
        const dayOfTheWeek = dayOfTheWeekMap[new Date().getDay()];
        const timerData = await this.getData<TimerType>(DATAKEY);
        const timerDataForDay = timerData[dayOfTheWeek!] || {};
        if (!timerDataForDay[host]) {
            timerDataForDay[host] = 0;
        }
        timerDataForDay[host] += seconds;
        this.save(DATAKEY, timerData);
    },

    /**
     * @description get the record for the specified day or current day
     * @param {string} key - data key
     */
    async getData<Type>(key: string): Promise<Type> {
        const fullData: Record<string, any> = await STORAGE.get();
        return fullData[key] || {};
    },

    /**
     * @description save in storage
     * @param {string} key - the key used in saving the record is the date
     * @param {object} value - value to save in the sync storage
     */
    async save(key: string, value: any) {
        await STORAGE.set({ [key]: value });
    },

    /**
     * @description set up all the records for social media sites supported by default
     */
    async initialize() {
        const record = await this.getData<ConfigType>('sites');
        if (!Object.values(record).length) {
            this.save('sites', allSites);
        }
    },

    getCurrentDate() {
        return new Date().toISOString().substr(0, 10);
    },

    async getCacheStorage<Type>() {
        const cache = await this.getData<Type>('cache');
        return {
            ...DEFAULT_CACHE,
            ...cache,
        }
    }
};
