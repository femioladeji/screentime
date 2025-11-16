import { daysOfTheWeekEnum, type TimerType } from "./types";

const timer: TimerType = {
    [daysOfTheWeekEnum.saturday]: {
        instagram: 2000,
        youtube: 2240,
        twitter: 2000,
        facebook: 1800,
        github: 1800,
        google: 1000
    },
    [daysOfTheWeekEnum.sunday]: {
        instagram: 2000,
        youtube: 2240,
        twitter: 2000,
        facebook: 1800,
        github: 1800,
        google: 1000
    },
    [daysOfTheWeekEnum.monday]: {},
    [daysOfTheWeekEnum.tuesday]: {
        instagram: 2000,
        youtube: 2240,
        twitter: 2000,
        facebook: 1800,
        github: 1800,
        google: 1000
    },
    [daysOfTheWeekEnum.wednesday]: {},
    [daysOfTheWeekEnum.thursday]: {
        instagram: 2000,
        youtube: 2240,
        twitter: 2000,
        facebook: 1800,
        github: 1800,
        google: 1000
    },
    [daysOfTheWeekEnum.friday]: {}
};
const data = {
    timer,
    sites: {
        facebook: {
            control: true,
            days: {
                [daysOfTheWeekEnum.friday]: [
                    {
                        from: '09:00',
                        to: '17:00'
                    }
                ],
                [daysOfTheWeekEnum.monday]: [
                    {
                        from: '09:00',
                        to: '17:00'
                    }
                ],
                [daysOfTheWeekEnum.thursday]: [
                    {
                        from: '09:00',
                        to: '17:00'
                    }
                ],
                [daysOfTheWeekEnum.tuesday]: [
                    {
                        from: '09:00',
                        to: '17:00'
                    }
                ],
                [daysOfTheWeekEnum.wednesday]: [
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
                [daysOfTheWeekEnum.friday]: [
                    {
                        from: '09:00',
                        to: '17:00'
                    }
                ],
                [daysOfTheWeekEnum.monday]: [
                    {
                        from: '09:00',
                        to: '17:00'
                    }
                ],
                [daysOfTheWeekEnum.thursday]: [
                    {
                        from: '09:00',
                        to: '17:00'
                    }
                ],
                [daysOfTheWeekEnum.tuesday]: [
                    {
                        from: '09:00',
                        to: '17:00'
                    }
                ],
                [daysOfTheWeekEnum.wednesday]: [
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
                [daysOfTheWeekEnum.friday]: [
                    {
                        from: '09:00',
                        to: '17:00'
                    }
                ],
                [daysOfTheWeekEnum.monday]: [
                    {
                        from: '09:00',
                        to: '17:00'
                    }
                ],
                [daysOfTheWeekEnum.thursday]: [
                    {
                        from: '09:00',
                        to: '17:00'
                    }
                ],
                [daysOfTheWeekEnum.tuesday]: [
                    {
                        from: '09:00',
                        to: '17:00'
                    }
                ],
                [daysOfTheWeekEnum.wednesday]: [
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
            title: 'YouTube',
        }
    },
    settings: {
        theme: 'flash'
    }
};

export default {
    async get() {
        return data;
    },
    async set(details: any) {
        const key = Object.keys(details)[0];
        if (key) {
            // @ts-ignore
            data[key] = details[key!];
        }
    }
};
