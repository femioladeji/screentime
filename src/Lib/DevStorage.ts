import { type Timer } from './Types'

const timer: Timer = {
  saturday: {
    usage: {
      instagram: 1000,
      youtube: 1500,
      twitter: 2200,
      facebook: 800,
      github: 900,
      google: 1300
    }
  },
  sunday: {
    usage: {
      instagram: 550,
      youtube: 800,
      twitter: 3600,
      facebook: 2200,
      github: 900,
      google: 240
    }
  },
  monday: {
    usage: {
      instagram: 950,
      youtube: 400,
      twitter: 1800,
      facebook: 360,
      github: 720,
      google: 1920
    }
  },
  tuesday: {
    usage: {
      instagram: 0,
      youtube: 1200,
      twitter: 60,
      facebook: 600,
      github: 300,
      google: 1000
    }
  },
  wednesday: {
    usage: {}
  },
  thursday: {
    usage: {
      instagram: 2000,
      youtube: 2240,
      twitter: 2000,
      facebook: 1800,
      github: 1800,
      google: 1000
    }
  },
  friday: {
    usage: {
      instagram: 1000,
      youtube: 4000,
      twitter: 2000,
      facebook: 1800,
    }
  }
}

const data = {
  timer,
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
      time: 10,
      url: '*://*.facebook.com/',
      title: 'Facebook'
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
      time: 10,
      url: '*://*.instagram.com/',
      title: 'Instagram'
    },
    netflix: {
      control: true,
      time: 0,
      url: 'https://netflix.com',
      title: 'Netflix'
    },
    x: {
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
      time: 10,
      url: '*://*.x.com/',
      title: 'X'
    },
    youtube: {
      control: false,
      time: 60,
      url: '*://*.youtube.com/',
      title: 'YouTube'
    }
  },
  settings: {
    theme: 'flash'
  }
} as const

type StorageData = typeof data

export const get = async (): Promise<StorageData> => {
  return data
}

export const set = async (details: any): Promise<void> => {
  const key = Object.keys(details)[0]
  if (key) {
    // @ts-ignore
    data[key] = details[key!]
  }
}
