<script setup lang="ts">
import EachAppRow from '@/components/EachAppRow.vue'
import { CONFIG_KEY, DATA_KEY, daysOfTheWeek, type SiteConfigMap, type Timer } from '@/Lib'
import * as utils from '@/Lib/Utils'
import { computed, onMounted, ref } from 'vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';

const options = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Idle', value: 'idle' }
]
const selectedFilter = ref('')
const timerDataForCurrentDay = ref<Record<string, number>>({})
const sitesConfiguration = ref<SiteConfigMap>({})

onMounted(async (): Promise<void> => {
  const timerData = await utils.getData<Timer>(DATA_KEY)
  const configData = await utils.getData<SiteConfigMap>(CONFIG_KEY)
  const currentDayOfWeek = daysOfTheWeek[new Date().getDay()]
  timerDataForCurrentDay.value = timerData?.[currentDayOfWeek!] || {}
  sitesConfiguration.value = configData || {}
})

const filteredApps = computed((): SiteConfigMap => {
  if (selectedFilter.value === 'all') {
    return sitesConfiguration.value
  }
  const configurationClone = { ...sitesConfiguration.value }
  const siteNameKeys = Object.keys(configurationClone)
  siteNameKeys.forEach((key) => {
    if (
      (selectedFilter.value === 'active' && !configurationClone?.[key]?.control) ||
      (selectedFilter.value === 'idle' && configurationClone?.[key]?.control)
    ) {
      delete configurationClone[key]
    }
  })
  return configurationClone
})

const updateAppControl = async (appKey: string, value: boolean): Promise<void> => {
  if (sitesConfiguration.value[appKey]) {
    sitesConfiguration.value[appKey].control = value
    await utils.saveConfiguration<SiteConfigMap>(CONFIG_KEY, sitesConfiguration.value)
  }
}

const removeAppControl = async (appKey: string): Promise<void> => {
  if (sitesConfiguration.value[appKey]) {
    delete sitesConfiguration.value[appKey]
    await utils.saveConfiguration<SiteConfigMap>(CONFIG_KEY, sitesConfiguration.value)
  }
}
</script>

<template>
  <main>
    <div class="content">
      <div class="apps-header">
        <div class="page-title">
          <span class="page-title-caption">Time Sheet ⏱️</span>
          <span>You have {{ Object.keys(sitesConfiguration).length }} time-blocked websites</span>
        </div>
        <v-select :clearable="false" class="filter" :options="options" v-model="selectedFilter" label="label"
          :reduce="(option: { label: string; value: string }) => option.value" placeholder="Filter by" />

      </div>
      <table>
        <thead>
          <tr>
            <th width="35%">Site</th>
            <th style="text-align: center;">Time Scheduled</th>
            <th style="text-align: center;">Time Spent</th>
            <th style="text-align: center;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(value, key) in filteredApps" :key="key">
            <EachAppRow :siteKey="key" :details="value" :time="timerDataForCurrentDay[key] || 0"
              @update="updateAppControl" @remove="removeAppControl" />
          </tr>
        </tbody>
      </table>

    </div>
    <div class="applist-footer">
      <div>
        <span class="hint">Hint</span>
        Press <span style="font-weight: bold;">Alt + T / Option + T</span> (mac) to toggle all on/off
      </div>
      <button class="btn add-timer" @click="$router.push('/app')">
        + Add Timer
      </button>
    </div>
  </main>
</template>

<style lang="css" scoped>
.app-title {
  font-size: 16px;
}

.apps-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.apps-header .action {
  display: flex;
  align-items: center;
}

body.dark-mode .count {
  background: #828282;
}

.app-list {
  margin-top: 32px;
  width: 100%;
  border-top: 1px solid #e0e0e0;
}

.filter {
  color: var(--text-color);
}

.filter .vs__selected {
  color: var(--text-color);
}

.filter .vs__dropdown-toggle {
  border-radius: 0;
  border: 0;
  border-bottom: 1px solid var(--active_link);
  padding-bottom: 8px;
}

.filter .vs__selected-options {
  width: 100px;
}

.filter .vs__dropdown-menu {
  right: 0;
  left: auto;
  padding: 0px;
}

.filter .vs__open-indicator {
  fill: var(--icon_default);
}

.modal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
  background: rgba(0, 0, 0, 0.3);
}

.edit-modal {
  margin: 71px 21px;
  border-radius: 8px;
  background: var(--bg);
}

table {
  margin-top: 24px;
  border-collapse: collapse;
  border-color: #E2E2E2;
  width: 100%;
  font-size: 12px;
  text-align: left;
}

table thead th {
  font-weight: normal;
}

table th {
  padding: 10px 14px;
  border: 1px solid #E2E2E2;
}

table th {
  background: #f5f5f5;
  font-weight: bold;
}

.filter {
  color: var(--text-color);
  width: 150px;
}

.filter .vs__selected {
  color: var(--text-color);
}

.filter .vs__dropdown-toggle {
  border-radius: 0;
  border: 0;
  border-bottom: 1px solid var(--active_link);
  padding-bottom: 8px;
}

.filter .vs__selected-options {
  width: 100px;
}

.filter .vs__dropdown-menu {
  right: 0;
  left: auto;
  padding: 0px;
}

.filter .vs__open-indicator {
  fill: var(--icon_default);
}

.applist-footer {
  margin-top: 21px;
  border-top: 1px solid var(--nav_border);
  padding: 26px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.applist-footer .hint {
  color: #4C4B55;
  background-color: #F4F4F6;
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
}

.applist-footer .add-timer {
  background-color: #767DE8;
  color: #FFFFFF;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
