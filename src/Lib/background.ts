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

const tabCloseInFlight = new Set<number>();

type TabCloseResult = 'closed' | 'already-gone' | 'busy' | 'failed' | 'invalid';

const RETRY_DELAYS_MS = [0, 100, 250, 500];

const isRetryableTabCloseError = (message: string): boolean => {
    const normalized = message.toLowerCase();
    return normalized.includes('cannot be edited right now') || normalized.includes('dragging a tab');
};

const isTabAlreadyGoneError = (message: string): boolean => {
    const normalized = message.toLowerCase();
    return normalized.includes('no tab with id') || normalized.includes('tab was closed');
};

const wait = async (ms: number): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, ms));
};

const removeTabOnce = (tabId: number): Promise<string | null> => {
    return new Promise((resolve) => {
        try {
            chrome.tabs.remove(tabId, () => {
                // runtime.lastError is only guaranteed during this callback.
                resolve(chrome.runtime.lastError?.message ?? null);
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            resolve(message);
        }
    });
};

const safeCloseTab = async (tabId: number, source: string): Promise<TabCloseResult> => {
    if (!Number.isInteger(tabId)) {
        return 'invalid';
    }

    if (tabCloseInFlight.has(tabId)) {
        return 'busy';
    }

    tabCloseInFlight.add(tabId);

    try {
        for (const delay of RETRY_DELAYS_MS) {
            if (delay > 0) {
                await wait(delay);
            }

            const errorMessage = await removeTabOnce(tabId);
            if (!errorMessage) {
                return 'closed';
            }

            if (isTabAlreadyGoneError(errorMessage)) {
                return 'already-gone';
            }

            if (!isRetryableTabCloseError(errorMessage)) {
                console.error(`[tabs.remove] ${source} failed for tab ${tabId}: ${errorMessage}`);
                return 'failed';
            }
        }

        console.warn(`[tabs.remove] ${source} retry limit reached for tab ${tabId}`);
        return 'failed';
    } finally {
        tabCloseInFlight.delete(tabId);
    }
};

const setDelayedAction = async (name: string, tabId: number): Promise<void> => {
    const { configuration } = cacheStorage;
    if (configuration[name] && configuration[name].control) {
        const currentDayOfTheWeek = utils.getDayOfTheWeek();
        const { data } = cacheStorage;
        let timeSpent = 0;
        if (data?.[currentDayOfTheWeek]?.usage?.[name]) {
            timeSpent = data[currentDayOfTheWeek]!.usage[name]!;
        }
        const secondsToLimit = configuration[name].time * 60 - timeSpent;
        const secondsToNextBlock = utils.getSecondsToNextBlock(configuration[name]);
        let secondsLeft = secondsToLimit;
        if (secondsToNextBlock && secondsToNextBlock < secondsToLimit) {
            secondsLeft = secondsToNextBlock;
        }
        delayHandler = setTimeout(async () => {
            const closeResult = await safeCloseTab(tabId, 'delayed close');
            if (closeResult === 'closed') {
                utils.notify(`You can no longer be on ${name}`);
            } else if (closeResult === 'already-gone') {
                console.info(`[tabs.remove] delayed close skipped, tab ${tabId} was already gone`);
            }
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
                await safeCloseTab(id!, `time exceeded for ${name}`);
            } else if (utils.isTimeframeBlocked(cacheStorage, name)) {
                await safeCloseTab(id!, `timeframe blocked for ${name}`);
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

const synchronize = async () => {
    const [configuration, data] = await Promise.all([
        utils.getData<SiteConfigMap>(CONFIG_KEY),
        utils.getData<Timer>(DATA_KEY)
    ]);

    cacheStorage.configuration = configuration;
    cacheStorage.data = data;
};

(async function () {
    await utils.initializeStorage();
    await synchronize();

    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (!changeInfo.url && changeInfo.status !== 'complete') {
            return;
        }

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

    chrome.storage.onChanged.addListener((changes, area) => {
        if (changes.sites || changes.timer) {
            synchronize();
        }
    });
}());
