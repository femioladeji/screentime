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
        chrome.tabs.remove(id);
      } else {
        cacheStorage.active.push({
          name,
          timeStamp: Date.now()
        });
      }
    }
  });
}

(function () {
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
    utils.end(cacheStorage.active);
    cacheStorage.active = [];
    getActiveTab();
  });

  chrome.windows.onFocusChanged.addListener(window => {
    if (window === -1) {
      utils.end(cacheStorage.active);
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
      const record = await Promise.all([utils.getData(CONFIGKEY), utils.getData(utils.getCurrentDate())]);
      cacheStorage.configuration = record[0];
      cacheStorage.data = record[1];
    }
  });
}());
