import allSites from './data';
// eslint-disable-next-line
const STORAGE = chrome.storage.local;

export default {
  async update(host, seconds) {
    const currentDate = this.getCurrentDate();
    const data = await this.getData(currentDate);
    if (data[host]) {
      data[host] += seconds;
    } else {
      data[host] = seconds;
    }
    this.save(currentDate, data);
  },

  /**
   * @description get the record for the specified day or current day
   * @param {string} key - data key
   */
  getData(key) {
    return new Promise((resolve) => {
      STORAGE.get(key, result => (result[key] ? resolve(result[key]) : resolve({})));
    });
  },

  /**
   * @description save in storage
   * @param {string} key - the key used in saving the record is the date
   * @param {object} value - value to save in the sync storage
   */
  save(key, value) {
    return new Promise((resolve) => {
      STORAGE.set({ [key]: value }, () => {
        resolve();
      });
    });
  },

  /**
   * @description set up all the records for social media sites supported by default
   */
  async initialize() {
    const record = await this.getData('sites');
    if (!Object.values(record).length) {
      this.save('sites', allSites);
    }
  },

  getCurrentDate() {
    return new Date().toISOString().substr(0, 10);
  }
};
