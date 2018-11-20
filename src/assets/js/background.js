import utils, { networkFilters, CONFIGKEY } from './utils';

let cacheStorage = {
  active: {},
  configuration: {},
  data: {}
};

let delayHandler;

const setActive = async () => {
  const activeTab = await utils.getActiveTab();
  if (activeTab) {
    const { url, id } = activeTab;
    const name = utils.getName(url);
    if (utils.isTabAMatch(name)) {
      if (utils.isTimeExceeded(cacheStorage, name)) {
        try {
          chrome.tabs.remove(id);
        } catch (error) {
          console.log('error', error);
        }
      } else {
        if (cacheStorage.active.name !== name) {
          // if a different site is active then end the existing site's session
          utils.end(cacheStorage);
          cacheStorage.active = {
            name,
            timeStamp: Date.now()
          };
          console.log(`${cacheStorage.active.name} visited at ${cacheStorage.active.timeStamp}`);
          clearTimeout(delayHandler);
          setDelayedAction(name);
          console.log('timer cleared and reset');
        }
      }
    }
  }
}

const setDelayedAction = async (name) => {
  const configuration = await utils.getData(CONFIGKEY);
  if (configuration[name].control) {
    const currentDate = utils.getCurrentDate();
    const { data } = cacheStorage;
    const timeSpent = data[currentDate] && data[currentDate][name] || 0;
    const secondsLeft = configuration[name].time * 60 - timeSpent;
    delayHandler = setTimeout(() => {
      utils.notify(name, true);
    }, secondsLeft * 1000);
  }
}

const synchronize = async (fetchData = false) => {
  const promises = [utils.getData(CONFIGKEY)];
  if (fetchData) {
    promises.push(utils.getData(utils.getCurrentDate()));
  }
  const details = await Promise.all(promises);
  cacheStorage.configuration = details[0];
  if (fetchData) {
    const currentDate = utils.getCurrentDate();
    if (!cacheStorage.data[currentDate]) {
      cacheStorage.data = {};
      cacheStorage.data[currentDate] = details[1];
    }
  }
}

(function () {
  synchronize(true);

  chrome.tabs.onUpdated.addListener(() => {
    setActive();
  });

  chrome.tabs.onActivated.addListener(() => {
    clearTimeout(delayHandler);
    if (cacheStorage.active.name) {
      utils.end(cacheStorage);
    }
    setActive();
  });

  chrome.windows.onFocusChanged.addListener(window => {
    clearTimeout(delayHandler);
    if (window === -1) {
      utils.end(cacheStorage);
    } else {
      setActive();
    }
  });

  chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
    if (buttonIndex === 0) {
      //close the tab
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, activeTab => {
        chrome.tabs.remove(activeTab[0].id);
      });
    }
  });

  setInterval(synchronize, 10000);
}());
