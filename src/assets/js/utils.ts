import storage from "./storage";
import { dayOfTheWeekMap, type ConfigType } from "./types";

export const DATAKEY = 'timer';
export const CONFIGKEY = 'sites';
export const ALLCOLORS = [
    '#CC1515',
    '#F23C3C',
    '#F28A8A',
    '#E64AD6',
    '#B31EAD',
    '#BAE29B',
    '#89E540',
    '#6DE733',
    '#2ABA86',
    '#15A862',
    '#A6C6E3',
    '#58B3E7',
    '#1780E1',
    '#9080F2',
    '#6525ED'
];
export default {
    getData<Type>(key: string) {
        return storage.getData<Type>(key);
    },

    saveConfiguration<Type>(key: string, data: Type) {
        return storage.save(key, data);
    },

    getBarBackgroundColors(siteKeys: string[], allSitesConfig: ConfigType): string[] {
        let index = -1;
        return siteKeys.map((each) => {
            if (!allSitesConfig[each]?.color) {
                index = (index + 1) % ALLCOLORS.length;
                return ALLCOLORS[index]!;
            }
            return allSitesConfig[each].color;
        });
    },

    isTabAMatch(tabUrl: string, configuration: ConfigType): boolean {
        const allSites = Object.values(configuration).map(each => each.url);
        const tabUrlParts = tabUrl.split(".")
        return allSites.some(each => {
            return tabUrlParts.every(eachPart => each.includes(eachPart))
        });
    },

    getActiveTab() {
        return new Promise((resolve) => {
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, (activeTab) => {
                resolve(activeTab[0]);
            });
        });
    },

    end(cacheStorage: any) {
        const moment = Date.now();
        const { active } = cacheStorage;
        if (active.name) {
            const currentDayOfWeek = dayOfTheWeekMap[new Date().getDay()];
            const currentDate = new Date().toISOString().substring(0, 10);
            const startOfDayTimestamp = new Date(`${currentDate}T00:00:00`).getTime();
            const start = Math.max(startOfDayTimestamp, active.timeStamp);
            const seconds = (moment - start) / 1000;
            if (!cacheStorage.data[currentDate]) {
                cacheStorage.data = {};
                cacheStorage.data[currentDate] = {};
            }
            // intentionally manipulating cache storage to keep it updated real time
            const currentlyUsedTime = cacheStorage.data[currentDate][active.name] || 0;
            cacheStorage.data[currentDate][active.name] = currentlyUsedTime + seconds;
            cacheStorage.active = {};
            storage.update(active.name, seconds);
        }
    },

    getName(url: string) {
        try {
            const host = new URL(url).hostname;
            return host.replace('www.', '').replace('.com', '');
        } catch (error) {
            return '';
        }
    },

    notify(message: string) {
        const notificationObject = {
            type: chrome.notifications.TemplateType.BASIC,
            iconUrl: 'images/icon_128.png',
            title: 'SCREENTIME',
            message
        };
        // eslint-disable-next-line
        chrome.notifications.create(notificationObject);
    },
}