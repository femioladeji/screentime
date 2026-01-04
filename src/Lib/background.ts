import * as utils from './Utils';
import { CONFIG_KEY, DATA_KEY } from './Constants';
import type { DayOfTheWeek, SiteConfigMap, Timer } from './Types';

const cacheStorage: {
    active: { name?: string; timeStamp?: number };
    configuration: SiteConfigMap;
    data: Timer;
} = {
    active: {},
    configuration: {},
    data: {} as Timer
};

let delayHandler: number;

const setDelayedAction = async (name: string, tabId: number): Promise<void> => {
    const { configuration } = cacheStorage;
    if (configuration[name] && configuration[name].control) {
        const currentDayOfTheWeek = utils.getDayOfTheWeek();
        const { data } = cacheStorage;
        let timeSpent = 0;
        if (data?.[currentDayOfTheWeek]?.[name]) {
            timeSpent = data[currentDayOfTheWeek][name];
        }
        const secondsToLimit = configuration[name].time * 60 - timeSpent;
        const secondsToNextBlock = utils.getSecondsToNextBlock(configuration[name]);
        let secondsLeft = secondsToLimit;
        if (secondsToNextBlock && secondsToNextBlock < secondsToLimit) {
            secondsLeft = secondsToNextBlock;
        }
        delayHandler = setTimeout(() => {
            chrome.tabs.remove(tabId);
            utils.notify(`You can no longer be on ${name}`);
        }, secondsLeft * 1000);
    }
};

const setActive = async () => {
    const activeTab = await utils.getActiveTab();
    if (activeTab) {
        const { url, id } = activeTab;
        const name = utils.getName(url!);
        if (utils.isTabAMatch(name, cacheStorage.configuration)) {
            if (utils.isTimeExceeded(cacheStorage, name)) {
                chrome.tabs.remove(id!);
            } else if (utils.isTimeframeBlocked(cacheStorage, name)) {
                chrome.tabs.remove(id!);
            } else if (cacheStorage.active.name !== name) {
                utils.end(cacheStorage);
                cacheStorage.active = {
                    name,
                    timeStamp: Date.now()
                };
                clearTimeout(delayHandler);
                setDelayedAction(name, id!);
            }
        }
    }
};

const synchronize = async (fetchData = false) => {
    const promises: Promise<SiteConfigMap | Timer>[] = [utils.getData<SiteConfigMap>(CONFIG_KEY)];
    let currentDate;
    if (fetchData) {
        currentDate = utils.getCurrentDate();
        promises.push(utils.getData<Timer>(DATA_KEY));
    }
    const details = await Promise.all(promises);
    cacheStorage.configuration = details[0] as SiteConfigMap;
    if (fetchData) {
        const currentDayOfTheWeek = utils.getDayOfTheWeek();
        if (!cacheStorage.data[currentDayOfTheWeek]) {
            cacheStorage.data = {} as Timer;
            cacheStorage.data[currentDayOfTheWeek] = details[1]![currentDayOfTheWeek] as Timer[DayOfTheWeek];
        }
    }
};

(async function () {
    await utils.initializeStorage();
    synchronize(true);

    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        const { url } = tab;
        const name = utils.getName(url!);
        if (cacheStorage.active.name !== name) {
            setActive();
        }
    });

    chrome.tabs.onActivated.addListener(() => {
        clearTimeout(delayHandler);
        if (cacheStorage.active.name) {
            utils.end(cacheStorage);
        }
        setActive();
    });

    chrome.windows.onFocusChanged.addListener((window) => {
        clearTimeout(delayHandler);
        if (window === -1) {
            utils.end(cacheStorage);
        } else {
            setActive();
        }
    });

    chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
        if (buttonIndex === 0) {
            // close the tab
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, (activeTab) => {
                chrome.tabs.remove(activeTab[0]?.id!);
            });
        }
    });

    chrome.storage.onChanged.addListener((changes, area) => {
        if (changes.sites) {
            synchronize();
        }
    });
}());
