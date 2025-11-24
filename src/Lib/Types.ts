export type DayOfTheWeek = 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday'

export interface TimeBlock {
  from: string
  to: string
}

export type Timer = Record<DayOfTheWeek, Record<string, number>>

export type DailyTimeBlocks = Record<DayOfTheWeek, Array<TimeBlock>>

export interface SiteConfig {
  control: boolean
  days?: DailyTimeBlocks
  time: number
  url: string
  title: string
  color?: string
}

export type SiteConfigMap = Record<string, SiteConfig>
