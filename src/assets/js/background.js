import utils, { CONFIGKEY, DATAKEY } from './utils';

const cacheStorage = {
  active: {},
  configuration: {},
  data: {}
};

let delayHandler;

const setDelayedAction = async (name) => {
  const configuration = await utils.getData(CONFIGKEY);
  if (configuration[name].control) {
    const currentDate = utils.getCurrentDate();
    const { data } = cacheStorage;
    let timeSpent = 0;
    if (data[currentDate] && data[currentDate][name]) {
      timeSpent = data[currentDate][name];
    }
    const secondsLeft = configuration[name].time * 60 - timeSpent;
    delayHandler = setTimeout(() => {
      utils.notify(name, true);
    }, secondsLeft * 1000);
  }
};

const setActive = async () => {
  const activeTab = await utils.getActiveTab();
  if (activeTab) {
    const { url, id } = activeTab;
    const name = utils.getName(url);
    if (utils.isTabAMatch(name)) {
      if (utils.isTimeExceeded(cacheStorage, name)) {
        // eslint-disable-next-line
        chrome.tabs.remove(id);
      } else if (cacheStorage.active.name !== name) {
        // if a different site is active then end the existing site's session
        utils.end(cacheStorage);
        cacheStorage.active = {
          name,
          timeStamp: Date.now()
        };
        clearTimeout(delayHandler);
        setDelayedAction(name);
      }
    }
  }
};

const synchronize = async (fetchData = false) => {
  const promises = [utils.getData(CONFIGKEY)];
  let currentDate;
  if (fetchData) {
    currentDate = utils.getCurrentDate();
    promises.push(utils.getData(DATAKEY));
  }
  const details = await Promise.all(promises);
  [cacheStorage.configuration] = details;
  if (fetchData) {
    if (!cacheStorage.data[currentDate]) {
      cacheStorage.data = {};
      cacheStorage.data[currentDate] = details[1][currentDate];
    }
  }
};

// eslint-disable-next-line
(function () {
  synchronize(true);

  // eslint-disable-next-line
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    const { url } = tab;
    const name = utils.getName(url);
    if (cacheStorage.active.name !== name) {
      setActive();
    }
  });

  // eslint-disable-next-line
  chrome.tabs.onActivated.addListener(() => {
    clearTimeout(delayHandler);
    if (cacheStorage.active.name) {
      utils.end(cacheStorage);
    }
    setActive();
  });

  // eslint-disable-next-line
  chrome.windows.onFocusChanged.addListener((window) => {
    clearTimeout(delayHandler);
    if (window === -1) {
      utils.end(cacheStorage);
    } else {
      setActive();
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

  // eslint-disable-next-line
  chrome.storage.onChanged.addListener((changes, area) => {
    if (changes.sites && area === 'local') {
      synchronize();
    }
  });
}());
