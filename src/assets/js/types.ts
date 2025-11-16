export enum daysOfTheWeekEnum {
    sunday = 'sunday',
    monday = 'monday',
    tuesday = 'tuesday',
    wednesday = 'wednesday',
    thursday = 'thursday',
    friday = 'friday',
    saturday = 'saturday'
}

export type TimerType = Record<daysOfTheWeekEnum, Record<string, number>>;

export const dayOfTheWeekMap: Record<number, daysOfTheWeekEnum> = {
    0: daysOfTheWeekEnum.sunday,
    1: daysOfTheWeekEnum.monday,
    2: daysOfTheWeekEnum.tuesday,
    3: daysOfTheWeekEnum.wednesday,
    4: daysOfTheWeekEnum.thursday,
    5: daysOfTheWeekEnum.friday,
    6: daysOfTheWeekEnum.saturday
};

export type ConfigProperties = {
    control: boolean;
    days?: Record<daysOfTheWeekEnum, Array<{ from: string; to: string }>>;
    time: number;
    url: string;
    title: string;
    color?: string;
}
export type ConfigType = Record<string, ConfigProperties>;