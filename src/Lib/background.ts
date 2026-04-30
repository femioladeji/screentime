import * as utils from './Utils';
import { CONFIG_KEY, DATA_KEY } from './Constants';
import type { SiteConfigMap, Timer } from './Types';

const cacheStorage: {
    active: { name?: string; timeStamp?: number };
    configuration: SiteConfigMap;
    data: Timer;
} = {
    active: {},
    configuration: {},
    data: {} as Timer
};

const HEARTBEAT_INTERVAL_MINUTES = 0.5;
const HEARTBEAT_ALARM = 'screentime-heartbeat';
const DELAYED_ACTION_ALARM = 'screentime-delayed-action';

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
                resolve(chrome.runtime.lastError?.message ?? null);
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            resolve(message);
        }
    });
};

const safeCloseTab = async (tabId: number): Promise<TabCloseResult> => {
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
                console.error(`[tabs.remove] failed for tab ${tabId}: ${errorMessage}`);
                return 'failed';
            }
        }

        console.warn(`[tabs.remove] retry limit reached for tab ${tabId}`);
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
            timeSpent = data[currentDayOfTheWeek].usage[name]!;
        }
        const secondsToLimit = configuration[name].time * 60 - timeSpent;
        const secondsToNextBlock = utils.getSecondsToNextBlock(configuration[name]);
        let secondsLeft = secondsToLimit;
        if (secondsToNextBlock && secondsToNextBlock < secondsToLimit) {
            secondsLeft = secondsToNextBlock;
        }
        const delayMs = Math.max(0, Math.floor(secondsLeft * 1000));

        void chrome.alarms.create(DELAYED_ACTION_ALARM, {
            when: Date.now() + delayMs,
            periodInMinutes: undefined
        });
        await chrome.storage.local.set({
            [DELAYED_ACTION_ALARM]: { name, tabId }
        });
    }
};

const handleDelayedAction = async (): Promise<void> => {
    const payload = await chrome.storage.local.get(DELAYED_ACTION_ALARM);
    const delayedPayload = payload[DELAYED_ACTION_ALARM] as { name: string; tabId: number } | undefined;
    if (!delayedPayload?.name || delayedPayload.tabId === undefined) return;

    const { name, tabId } = delayedPayload;
    await chrome.storage.local.remove(DELAYED_ACTION_ALARM);

    const { configuration } = cacheStorage;
    if (configuration[name] && configuration[name].control) {
        const displayName = utils.getConfiguredName(configuration, name);
        const closeResult = await safeCloseTab(tabId);
        if (closeResult === 'closed') {
            utils.notify(`You can no longer be on ${displayName}`);
        } else if (closeResult === 'already-gone') {
            console.info(`[tabs.remove] delayed close skipped, tab ${tabId} was already gone`);
        }
    }
};

const flushActiveTime = async (): Promise<void> => {
    const { active } = cacheStorage;
    if (!active.name || !active.timeStamp) return;

    const moment = Date.now();
    const start = Number(active.timeStamp);
    if (!Number.isFinite(start) || start >= moment) return;

    const seconds = Math.max(0, (moment - start) / 1000);
    if (seconds <= 0) return;

    const dayOfTheWeek = utils.getDayOfTheWeek();
    const currentDate = utils.getCurrentDate();

    if (!cacheStorage.data[dayOfTheWeek] || cacheStorage.data[dayOfTheWeek].date !== currentDate) {
        cacheStorage.data[dayOfTheWeek] = {
            date: currentDate,
            usage: {}
        };
    } else if (!cacheStorage.data[dayOfTheWeek].usage) {
        cacheStorage.data[dayOfTheWeek].usage = {};
    }

    cacheStorage.data[dayOfTheWeek].usage[active.name] =
        (cacheStorage.data[dayOfTheWeek].usage[active.name] || 0) + seconds;

    cacheStorage.active.timeStamp = moment;
    await chrome.storage.local.set({ [DATA_KEY]: cacheStorage.data });
};

const setActive = async () => {
    const activeTab = await utils.getActiveTab();
    if (activeTab) {
        const { url, id } = activeTab;
        const configurationTabKey = utils.isTabAMatch(url!, cacheStorage.configuration);
        if (configurationTabKey) {
            if (utils.isTimeExceeded(cacheStorage, configurationTabKey)) {
                await safeCloseTab(id!);
            } else if (utils.isTimeframeBlocked(cacheStorage, configurationTabKey)) {
                await safeCloseTab(id!);
            } else if (cacheStorage.active.name !== configurationTabKey) {
                await utils.end(cacheStorage);
                cacheStorage.active = {
                    name: configurationTabKey,
                    timeStamp: Date.now()
                };
                void chrome.alarms.clear(DELAYED_ACTION_ALARM);
                await chrome.storage.local.remove(DELAYED_ACTION_ALARM);
                void setDelayedAction(configurationTabKey, id!);
            }
        } else if (cacheStorage.active.name) {
            void chrome.alarms.clear(DELAYED_ACTION_ALARM);
            await chrome.storage.local.remove(DELAYED_ACTION_ALARM);
            await utils.end(cacheStorage);
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

void (async function () {
    await utils.initializeStorage();
    await synchronize();

    void chrome.alarms.create(HEARTBEAT_ALARM, {
        periodInMinutes: HEARTBEAT_INTERVAL_MINUTES
    });

    chrome.alarms.onAlarm.addListener((alarm) => {
        void (async () => {
            if (alarm.name === HEARTBEAT_ALARM) {
                await flushActiveTime();
            } else if (alarm.name === DELAYED_ACTION_ALARM) {
                await handleDelayedAction();
            }
        })();
    });

    chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
        if (!changeInfo.url && changeInfo.status !== 'complete') {
            return;
        }

        const { url } = tab;
        const configurationTabKey = utils.isTabAMatch(url!, cacheStorage.configuration);
        if (cacheStorage.active.name !== configurationTabKey) {
            void setActive();
        }
    });

    chrome.tabs.onActivated.addListener(() => {
        void (async () => {
            void chrome.alarms.clear(DELAYED_ACTION_ALARM);
            if (cacheStorage.active.name) {
                await utils.end(cacheStorage);
            }
            await setActive();
        })();
    });

    chrome.windows.onFocusChanged.addListener((window) => {
        void chrome.alarms.clear(DELAYED_ACTION_ALARM);
        if (window === -1) {
            void utils.end(cacheStorage);
        } else {
            void setActive();
        }
    });

    chrome.storage.onChanged.addListener((changes, area) => {
        if (changes.sites) {
            void synchronize();
        }
        if (area === 'local' && changes[DATA_KEY]) {
            cacheStorage.data = changes[DATA_KEY].newValue as Timer;
        }
    });
}());
