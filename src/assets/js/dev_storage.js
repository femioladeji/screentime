const data = {
  timer: {
    '2021-10-03': {
      instagram: 2000,
      youtube: 2240,
      twitter: 2000,
      facebook: 1800,
      github: 1800,
      google: 1000
    }
  },
  sites: {
    facebook: {
      control: true,
      days: {
        friday: [
          {
            from: '09:00',
            to: '17:00'
          }
        ],
        monday: [
          {
            from: '09:00',
            to: '17:00'
          }
        ],
        thursday: [
          {
            from: '09:00',
            to: '17:00'
          }
        ],
        tuesday: [
          {
            from: '09:00',
            to: '17:00'
          }
        ],
        wednesday: [
          {
            from: '09:00',
            to: '17:00'
          }
        ]
      },
      time: '10',
      url: '*://*.facebook.com/'
    },
    instagram: {
      control: true,
      days: {
        friday: [
          {
            from: '09:00',
            to: '17:00'
          }
        ],
        monday: [
          {
            from: '09:00',
            to: '17:00'
          }
        ],
        thursday: [
          {
            from: '09:00',
            to: '17:00'
          }
        ],
        tuesday: [
          {
            from: '09:00',
            to: '17:00'
          }
        ],
        wednesday: [
          {
            from: '09:00',
            to: '17:00'
          }
        ]
      },
      time: '10',
      url: '*://*.instagram.com/'
    },
    netflix: {
      control: true,
      time: 0,
      url: 'https://netflix.com'
    },
    twitter: {
      control: true,
      days: {
        friday: [
          {
            from: '09:00',
            to: '17:00'
          }
        ],
        monday: [
          {
            from: '09:00',
            to: '17:00'
          }
        ],
        thursday: [
          {
            from: '09:00',
            to: '17:00'
          }
        ],
        tuesday: [
          {
            from: '09:00',
            to: '17:00'
          }
        ],
        wednesday: [
          {
            from: '09:00',
            to: '17:00'
          }
        ]
      },
      time: '10',
      url: '*://*.twitter.com/'
    },
    youtube: {
      control: false,
      time: '60',
      url: '*://*.youtube.com/'
    }
  },
  settings: {
    theme: 'flash'
  }
};

export default {
  get(key, callback) {
    callback(data);
  },
  set(details, callback) {
    const key = Object.keys(details)[0];
    data[key] = details[key];
    callback();
  }
};
