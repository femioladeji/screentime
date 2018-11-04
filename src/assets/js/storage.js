import { allSites } from './data';

const STORAGE = chrome.storage.sync;

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
   * @param {string} key - string for date, the format is YYYY-MM-DD
   */
  getData(key = this.getCurrentDate()) {
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
   * @description returns the current date in the format YYYY-MM-DD
   */
  getCurrentDate() {
    return new Date().toISOString().substr(0, 10);
  },

  /**
   * @description set up all the records for social media sites supported by default
   */
  async initialize() {
    const record = await getData('sites');
    if (!record) {
      this.save('sites', allSites);
    }
  }
};
