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
      }
    }
  });
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
      url,
      timeStamp
    } = details;
    const name = utils.getName(url);
    if (!utils.hostVisited(cacheStorage.active, name)) {
      cacheStorage.active.push({
        name,
        timeStamp
      });
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

  chrome.alarms.create('cache', {
    periodInMinutes: 1
  });

  chrome.alarms.onAlarm.addListener(async ({ name }) => {
    if (name === 'cache') {
      synchronize();
    }
  });
}());
