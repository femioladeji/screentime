import storage from './storage';

// set up initial data
storage.initialize();

export const DATAKEY = 'timer';
export const CONFIGKEY = 'sites';
export const SETTINGSKEY = 'settings';
export const PASSWORDKEY = 'password';

export const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export const ALLCOLORS = [
  '#CC1515',
  '#F23C3C',
  '#F28A8A',
  '#E64AD6',
  '#B31EAD',
  '#BAE29B',
  '#89E540',
  '#6DE733',
  '#2ABA86',
  '#15A862',
  '#A6C6E3',
  '#58B3E7',
  '#1780E1',
  '#9080F2',
  '#6525ED'
];

function pad(number) {
  if (number < 10) {
    return `0${number}`;
  }
  return number;
}

/**
 * intentionally did this to getISOstring that's not in UTC
 */
// eslint-disable-next-line no-extend-native
Date.prototype.toISOString = function iso() {
  return `${this.getFullYear()
  }-${pad(this.getMonth() + 1)
  }-${pad(this.getDate())
  }T${pad(this.getHours())
  }:${pad(this.getMinutes())
  }:${pad(this.getSeconds())
  }.${(this.getMilliseconds() / 1000).toFixed(3).slice(2, 5)}`;
};

export default {

  getData(key) {
    return storage.getData(key);
  },

  /**
   * @description check if tab is one of the sites being tracked
   * @param {string} tabUrl
   * @returns {boolean}
   */
  isTabAMatch(tabUrl, configuration) {
    const allSites = Object.values(configuration).map(each => each.url);
    const tabUrlParts = tabUrl.split(".")
    return allSites.some(each => {
      return tabUrlParts.every(eachPart => each.includes(eachPart))
    });
  },

  getActiveTab() {
    return new Promise((resolve) => {
      // eslint-disable-next-line
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, (activeTab) => {
        resolve(activeTab[0]);
      });
    });
  },

  /**
   * @description returns the current date in the format YYYY-MM-DD
   * @returns {string}
  */
  getCurrentDate() {
    return new Date().toISOString().substr(0, 10);
  },

  /**
   * @description close out all currently active sites being tracked
   * @param {Array<string>} all array of sites currently being tracked (this should
   * typically be an array of length 1)
   */
  end(cacheStorage) {
    const moment = Date.now();
    const { active } = cacheStorage;
    if (active.name) {
      const currentDate = this.getCurrentDate();
      const startOfDayTimestamp = new Date(`${currentDate}T00:00:00`).getTime();
      const start = Math.max(startOfDayTimestamp, active.timeStamp);
      const seconds = parseInt((moment - start) / 1000, 10);
      if (!cacheStorage.data[currentDate]) {
        cacheStorage.data = {};
        cacheStorage.data[currentDate] = {};
      }
      // intentionally manipulating cache storage to keep it updated real time
      const currentlyUsedTime = cacheStorage.data[currentDate][active.name] || 0;
      cacheStorage.data[currentDate][active.name] = currentlyUsedTime + seconds;
      cacheStorage.active = {};
      storage.update(active.name, seconds);
    }
  },

  /**
   * @description get site main name
   * @param {string} url url of the site visited
   * @returns {string} host name
   */
  getName(url) {
    try {
      const host = new URL(url).hostname;
      return host.replace('www.', '').replace('.com', '');
    } catch (error) {
      return '';
    }
  },

  /**
   * @description post a notification
   * @param {string} message message to show
   * @param {boolean} action if action buttons should be added
   */
  notify(message, action) {
    const notificationObject = {
      type: 'basic',
      iconUrl: 'images/icon_128.png',
      title: 'SCREENTIME',
      message
    };
    if (action) {
      notificationObject.buttons = [
        { title: 'Close Site' }
      ];
      notificationObject.requireInteraction = true;
    }
    // eslint-disable-next-line
    chrome.notifications.create(notificationObject, () => {
    });
  },

  saveConfiguration(key, data) {
    return storage.save(key, data);
  },

  /**
   * @description check if the allotted time has been exceeded
   * @param {string} name the site name
   * @returns {boolean} if the site should be blocked
   */
  isTimeExceeded({ configuration, data }, name) {
    // check if the control is on and time spent on the site is greater than allotted time
    const current = data[this.getCurrentDate()];
    if (configuration[name] && configuration[name].control
      && current && current[name] >= configuration[name].time * 60) {
      this.notify(`Time limit exceeded for ${name}`);
      return true;
    }
    return false;
  },

  isTimeframeBlocked({ configuration }, name) {
    const currentDate = new Date();
    const day = days[currentDate.getDay()];
    // load the days data if there's any
    if (!configuration[name]
        || !configuration[name].control
        || !configuration[name].days
        || !configuration[name].days[day]) {
      return false;
    }
    const currentTime = this.getCurrentTime(currentDate);
    for (let i = 0; i < configuration[name].days[day].length; i += 1) {
      const { from, to } = configuration[name].days[day][i];
      if (from <= currentTime && to >= currentTime) {
        this.notify(`You can't use ${name} between ${from} and ${to} on ${day}`);
        return true;
      }
    }
    return false;
  },

  getSecondsToNextBlock(config) {
    const currentDate = new Date();
    const day = days[currentDate.getDay()];
    if (!config || !config.days || !config.days[day]) {
      return null;
    }
    const frames = config.days[day];
    const currentTime = this.getCurrentTime(currentDate);
    let leastStart = null;
    frames.forEach((each) => {
      if (currentTime < each.from) {
        if (!leastStart) {
          leastStart = each.from;
        } else if (each.from < leastStart) {
          leastStart = each.from;
        }
      }
    });
    if (leastStart) {
      const leastStartDate = new Date();
      const leastStartParts = leastStart.split(':');
      leastStartDate.setHours(leastStartParts[0], leastStartParts[1]);
      return (leastStartDate - currentDate) / 1000;
    }
    return null;
  },

  getCurrentTime(currentDate = null) {
    if (!currentDate) {
      // eslint-disable-next-line no-param-reassign
      currentDate = new Date();
    }
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    if (hours < 10) {
      hours = `0${hours}`;
    }
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    return `${hours}:${minutes}`;
  },

  getBarBackgroundColors(siteKeys, allSitesConfig) {
    let index = -1;
    return siteKeys.map((each) => {
      if (!allSitesConfig[each] || !allSitesConfig[each].color) {
        index = (index + 1) % ALLCOLORS.length;
        return ALLCOLORS[index];
      }
      return allSitesConfig[each].color;
    });
  }
};
