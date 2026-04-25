<script setup lang="ts">
import BarChart from '@/components/BarChart.vue'
import { CONFIG_KEY, DATA_KEY, daysOfTheWeek, type SiteConfigMap, type Timer, type DayOfTheWeek } from '@/Lib'
import * as utils from '@/Lib/Utils'
import { computed, onMounted, ref } from 'vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

interface DayOption {
  label: string
  value: DayOfTheWeek
  date: Date
}

const timerDataForCurrentDay = ref<Record<string, number>>({})
const sitesConfiguration = ref<SiteConfigMap>({})
const allTimerData = ref<Timer>()
const loaded = ref(false)
const selectedDay = ref<DayOption>()

// Generate last 7 days options
const dayOptions = computed((): DayOption[] => {
  const options: DayOption[] = []
  const today = new Date()
  const seenDays = new Set<DayOfTheWeek>()

  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dayOfWeek = daysOfTheWeek[date.getDay()]

    // Skip if dayOfWeek is undefined or already seen
    if (!dayOfWeek || seenDays.has(dayOfWeek)) continue
    seenDays.add(dayOfWeek)

    let label = ''
    if (i === 0) {
      label = `Today (${dayOfWeek})`
    } else if (i === 1) {
      label = `Yesterday (${dayOfWeek})`
    } else {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      label = `${monthNames[date.getMonth()]} ${date.getDate()} (${dayOfWeek})`
    }

    options.push({
      label,
      value: dayOfWeek,
      date
    })
  }

  return options
})

const updateDisplayedData = (option: DayOption) => {
  if (allTimerData.value && option) {
    timerDataForCurrentDay.value = allTimerData.value[option.value]?.usage || {}
  }
}

onMounted(async (): Promise<void> => {
  const currentDayOfWeek = daysOfTheWeek[new Date().getDay()]
  const timerData = await utils.getData<Timer>(DATA_KEY)
  const configData = await utils.getData<SiteConfigMap>(CONFIG_KEY)

  allTimerData.value = timerData
  timerDataForCurrentDay.value = timerData?.[currentDayOfWeek!]?.usage || {}
  sitesConfiguration.value = configData || {}

  // Set today as default
  selectedDay.value = dayOptions.value[0]

  loaded.value = true
})
</script>

<template>
  <main>
    <div class="content">
      <div class="apps-header">
        <div class="page-title">
          <span class="page-title-caption">Activity Overview🔥</span>
          <span>Here's the analysis of your screen time</span>
        </div>
        <v-select v-if="loaded" :clearable="false" :close-on-select="true" class="day-selector" :options="dayOptions"
          v-model="selectedDay" label="label" placeholder="Select day" @update:modelValue="updateDisplayedData" />
      </div>

      <BarChart v-if="loaded" :data="timerDataForCurrentDay" :config="sitesConfiguration" />
    </div>
  </main>
</template>

<style scoped>
.content {
  padding: 32px 40px;
}

.apps-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.page-title {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title-caption {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
}

.page-title span:last-child {
  font-size: 13px;
  color: #828282;
}

.day-selector {
  color: var(--text-color);
  width: 200px;
}

.day-selector :deep(.vs__selected) {
  color: var(--text-color);
}

.day-selector :deep(.vs__dropdown-toggle) {
  border-radius: 6px;
  border: 1px solid #E0E0E0;
  padding: 8px 12px;
  background: var(--bg);
}

.day-selector :deep(.vs__dropdown-toggle):hover {
  border-color: #767DE8;
}

.day-selector :deep(.vs__selected-options) {
  flex-wrap: nowrap;
}

.day-selector :deep(.vs__dropdown-menu) {
  right: 0;
  left: auto;
  border-radius: 6px;
  border: 1px solid #E0E0E0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.day-selector :deep(.vs__dropdown-option) {
  padding: 10px 14px;
  font-size: 13px;
}

.day-selector :deep(.vs__dropdown-option--highlight) {
  background: rgba(118, 125, 232, 0.1);
  color: #767DE8;
}

.day-selector :deep(.vs__open-indicator) {
  fill: var(--icon_default);
}

.day-selector :deep(.vs__search) {
  display: none;
}

body.dark-mode .day-selector :deep(.vs__dropdown-toggle) {
  border-color: #828282;
}
</style>
