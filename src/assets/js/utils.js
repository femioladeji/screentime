import storage from './storage';
export const networkFilters = {
  urls: [
    "*://*.twitter.com/",
    "*://*.facebook.com/",
    "*://*.instagram.com/"
  ]
};
export const isTabAMatch = tabUrl => networkFilters.urls.some(each => each.includes(tabUrl));

export const getHostIndex = (store, name) => store.findIndex(each => each.name === name);

export const hostVisited = (store, name) => getHostIndex(store, name) >= 0

export const end = (all) => {
  const moment = Date.now();
  all.forEach(eachHost => {
    const seconds =parseInt((moment - eachHost.timeStamp) / 1000);
    storage.update(eachHost.name, seconds);
  });
};

export const getName = url => {
  const host = new URL(url).hostname;
  return host.replace('www.', '').replace('.com', '');
}
