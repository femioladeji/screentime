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
   * @param {string} date - format(YYYY-MM-DD) the date to retrieve data for
   */
  getData(date = this.getCurrentDate()) {
    return new Promise(resolve => {
      STORAGE.get(date, (result) => {
        return result[date] ? resolve(result[date]) : resolve({});
      });
    });
  },

  /**
   * @description save in storage
   * @param {string} key - the key used in saving the record is the date
   * @param {object} value - value to save in the sync storage
   */
  save(key, value) {
    return new Promise(resolve => {
      STORAGE.set({ [key] : value }, () => {
        resolve();
      });
    });
  },

  /**
   * @description returns the current date in the format YYYY-MM-DD
   */
  getCurrentDate() {
    return new Date().toISOString().substr(0, 10);
  }
}
