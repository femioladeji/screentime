import utils, { networkFilters, CONFIGKEY } from './utils';

let cacheStorage = {
  active: [],
  configuration: {},
  data: {}
};

const getActiveTab = () => {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, activeTab => {
    const { url, id } = activeTab[0];
    const name = utils.getName(url);
    if (utils.isTabAMatch(name)) {
      if (utils.isTimeExceeded(cacheStorage, name)) {
        try {
          chrome.tabs.remove(id);
        } catch (error) {
          console.log('error', error);
        }
      } else {
        cacheStorage.active.push({
          name,
          timeStamp: Date.now()
        });
        setDelayedAction(name);
      }
    }
  });
}

let delayHandler;

const setDelayedAction = async (name) => {
  clearTimeout(delayHandler);
  const configuration = await utils.getData(CONFIGKEY);
  if (configuration[name].control) {
    const secondsLeft = configuration[name].time * 60 - (cacheStorage.data[name] || 0);
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
    cacheStorage.data = details[1];
  }
}

(function () {
  synchronize(true);
  chrome.webRequest.onResponseStarted.addListener(details => {
    const {
      url
    } = details;
    const name = utils.getName(url);
    if (!utils.hostVisited(cacheStorage.active, name)) {
      getActiveTab();
    }
  }, networkFilters);

  chrome.tabs.onActivated.addListener(() => {
    // close all opened hosts
    utils.end(cacheStorage);
    cacheStorage.active = [];
    getActiveTab();
  });

  chrome.windows.onFocusChanged.addListener(window => {
    if (window === -1) {
      utils.end(cacheStorage);
      cacheStorage.active = [];
    } else {
      getActiveTab();
    }
  });

  chrome.webRequest.onBeforeRequest.addListener(details => {
    const cancelRequest = utils.isTimeExceeded(cacheStorage, utils.getName(details.url));
    return { cancel: cancelRequest };
  }, networkFilters, ['blocking']);

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
