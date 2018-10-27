import {
  isTabAMatch,
  hostVisited,
  networkFilters,
  end,
  getName
} from './utils';

let cacheStorage = [];

const getActiveTab = () => {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, activeTab => {
    const { url } = activeTab[0];
    const name = getName(url);
    if (isTabAMatch(name)) {
      cacheStorage.push({
        name,
        timeStamp: Date.now()
      });
    }
  });
}

(function () {
  chrome.webRequest.onResponseStarted.addListener((details) => {
    const {
      url,
      timeStamp,
      type
    } = details;
    const name = getName(url);
    if (!hostVisited(cacheStorage, name)) {
      cacheStorage.push({
        name,
        timeStamp
      });
    }
  }, networkFilters);

  chrome.tabs.onActivated.addListener(() => {
    // close all opened hosts
    end(cacheStorage);
    cacheStorage = [];
    getActiveTab();
  });
  chrome.windows.onFocusChanged.addListener(window => {
    if (window === -1) {
      end(cacheStorage);
      cacheStorage = [];
    } else {
      getActiveTab();
    }
  });
}());
