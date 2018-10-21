(function() {
  const allHosts = [];
  const networkFilters = {
      urls: [
        "*://*.twitter.com/",
        "*://*.facebook.com/",
        "*://*.instagram.com/"
      ]
  };

  const isTabAMatch = (tabUrl) => urls.some(each => each.includes(tabUrl));

  chrome.webRequest.onResponseStarted.addListener((details) => {
      const { url, timeStamp, type} = details;
      const host = new URL(url).hostname;
      if (!allHosts.includes(host)) {
        allHosts.push(host);
        console.log(`host: ${host} visited at ${new Date()} type = ${type}`);
      } else {
        console.log(`host: ${host} visited at ${new Date()} type = ${type}`);
      }
  }, networkFilters);

  chrome.tabs.onActivated.addListener((tab) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (a) => {
      const { url } = a;
      console.log(`${allHosts[0]} stopped at ${new Date()}`);
      allHosts.pop();
      if (url && isTabAMatch(url)) {
        const host = new URL(url).hostname;
        if (!allHosts.includes(host)) {
          allHosts.push(host);
          console.log(`host: ${host} visited at ${new Date()}`);
        } else {
          console.log(`host already there: ${host} visited at ${new Date()}`);
        }
      }
    });
    // chrome.windows.getCurrent((a) => {
    //   console.log('current window', a)
    // })
  });
  chrome.windows.onFocusChanged.addListener(({ windowId }) => {
    if(windowId === -1) {
      console.log(`${allHosts[0]} stopped at ${new Date()}`);
      allHosts.pop();
    }
  });
  // chrome.tabs.onRemoved.addListener((tab) => {
  //     const tabId = tab.tabId;
  //     if (!tabStorage.hasOwnProperty(tabId)) {
  //         return;
  //     }
  //     tabStorage[tabId] = null;
  // });
}());
