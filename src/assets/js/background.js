import utils, { CONFIGKEY, DATAKEY } from './utils';
import storage from './storage';

const setDelayedAction = async (name) => {
  const configuration = await utils.getData(CONFIGKEY);
  if (configuration[name] && configuration[name].control) {
    const currentDate = utils.getCurrentDate();
    const data = await utils.getData(DATAKEY);
    let timeSpent = 0;
    if (data[currentDate] && data[currentDate][name]) {
      timeSpent = data[currentDate][name];
    }
    const secondsToLimit = configuration[name].time * 60 - timeSpent;
    const secondsToNextBlock = utils.getSecondsToNextBlock(configuration[name]);
    let secondsLeft = secondsToLimit;
    if (secondsToNextBlock && secondsToNextBlock < secondsToLimit) {
      secondsLeft = secondsToNextBlock;
    }
    await chrome.alarms.create(name, {
      delayInMinutes: secondsLeft / 60,
    });
  }
};

const setActive = async () => {
  const activeTab = await utils.getActiveTab();
  if (activeTab) {
    const { url, id } = activeTab;
    const name = utils.getName(url);
    const cacheStorage = await storage.getCacheStorage();
    const data = await utils.getData(DATAKEY);
    const configuration = await utils.getData(CONFIGKEY);
    if (utils.isTabAMatch(name, configuration)) {
      if (utils.isTimeExceeded(data, configuration, name)) {
        // eslint-disable-next-line
        chrome.tabs.remove(id);
      } else if (utils.isTimeframeBlocked(configuration, name)) {
        // eslint-disable-next-line
        chrome.tabs.remove(id);
      } else if (cacheStorage.active.name !== name) {
        // if a different site is active then end the existing site's session
        let updatedCacheStorage = await utils.end();
        updatedCacheStorage.active = {
          name,
          timeStamp: Date.now()
        };
        await storage.save('cache', updatedCacheStorage);
        await chrome.alarms.clearAll();
        setDelayedAction(name, id);
      }
    }
  }
};

// eslint-disable-next-line
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  const { url } = tab;
  const name = utils.getName(url);
  const cacheStorage = await storage.getCacheStorage();
  if (cacheStorage.active.name !== name) {
    setActive();
  }
});

// eslint-disable-next-line
chrome.tabs.onActivated.addListener(async () => {
  await chrome.alarms.clearAll();
  const cacheStorage = await storage.getCacheStorage();
  if (cacheStorage.active.name) {
    const updatedCacheStorage = await utils.end();
    await storage.save('cache', updatedCacheStorage);
  }
  await setActive();
});

// eslint-disable-next-line
chrome.windows.onFocusChanged.addListener(async (window) => {
  await chrome.alarms.clearAll();
  if (window === -1) {
    const updatedCacheStorage = await utils.end();
    await storage.save('cache', updatedCacheStorage);
  } else {
    await setActive();
  }
});

// eslint-disable-next-line
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  if (buttonIndex === 0) {
    // close the tab
    // eslint-disable-next-line
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, (activeTab) => {
      // eslint-disable-next-line
      chrome.tabs.remove(activeTab[0].id);
    });
  }
});

chrome.alarms.onAlarm.addListener(({ name }) => {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, (activeTab) => {
    utils.notify(`You can no longer be on ${name}`);
    chrome.tabs.remove(activeTab[0].id);
  });
});
