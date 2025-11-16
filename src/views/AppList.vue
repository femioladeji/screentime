<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import EachAppRow from '../components/EachAppRow.vue';
import utils, { CONFIGKEY, DATAKEY } from '@/assets/js/utils';
import { dayOfTheWeekMap, type ConfigType, type TimerType } from '@/assets/js/types';

const options = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Idle', value: 'idle' },
];
const selectedFilter = ref('all');
const timerDataForCurrentDay = ref<Record<string, number>>({});
const sitesConfiguration = ref<ConfigType>({});

onMounted(async () => {
  const timerData = await utils.getData<TimerType>(DATAKEY);
  const configData = await utils.getData<ConfigType>(CONFIGKEY);
  const currentDayOfWeek = dayOfTheWeekMap[new Date().getDay()];
  timerDataForCurrentDay.value = timerData?.[currentDayOfWeek!] || {};
  sitesConfiguration.value = configData || {};
})

const filteredApps = computed(() => {
  if (selectedFilter.value === 'all') {
    return sitesConfiguration.value;
  }
  const configurationClone = { ...sitesConfiguration.value };
  const siteNameKeys = Object.keys(configurationClone);
  siteNameKeys.forEach((key) => {
    if ((selectedFilter.value === 'active' && !configurationClone?.[key]?.control)
      || (selectedFilter.value === 'idle' && configurationClone?.[key]?.control)) {
      delete configurationClone[key];
    }
  });
  return configurationClone;
});

const updateAppControl = async (appKey: string, value: boolean) => {
  if (sitesConfiguration.value[appKey]) {
    sitesConfiguration.value[appKey].control = value;
    await utils.saveConfiguration<ConfigType>(CONFIGKEY, sitesConfiguration.value);
  }
};

const removeAppControl = async (appKey: string) => {
  if (sitesConfiguration.value[appKey]) {
    delete sitesConfiguration.value[appKey];
    await utils.saveConfiguration<ConfigType>(CONFIGKEY, sitesConfiguration.value);
  }
};
</script>

<template>
  <main>
    <div class="content">
      <div class="apps-header">
        <div class="stats">
          <span class="timers-caption">Timers</span>
          <div class="count">5</div>
        </div>

        <select class="filter" v-model="selectedFilter" placeholder="Filter">
          <option v-for="option in options" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
      <div class="app-list">
        <EachAppRow v-for="(value, key) in filteredApps" :key="key" :siteKey="key" :details="value"
          :time="timerDataForCurrentDay[key] || 0" @update="updateAppControl" @remove="removeAppControl" />
      </div>
    </div>
  </main>
</template>

<style lang="css" scoped>
.app-title {
  font-size: 16px;
}

.timers-caption {
  font-weight: bold;
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

.stats {
  display: flex;
  align-items: center;
}

.count {
  padding: 0 5px;
  border-radius: 4px;
  background: #F2F2F2;
  margin-left: 8px;
}

body.dark-mode .count {
  background: #828282;
}

.app-list {
  margin-top: 32px;
  width: 100%;
  border-top: 1px solid #E0E0E0;
}

.apps-footer {
  margin-top: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.apps-footer .toggle-all {
  color: var(--active_link);
  border-color: #E0E0E0;
}

.apps-footer .btn {
  display: flex;
  height: 30px;
  align-items: center;
  padding: 0 6px;
  font-size: 12px;
}

.apps-footer .btn .shortcut {
  padding: 2px 6px;
  color: #EB5757;
  background: #FCE8E8;
  margin-left: 12px;
  border-radius: 4px;
}

.apps-footer .btn.add-timer {
  padding: 8px;
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

/* .list-item {
  display: inline-block;
  margin-right: 10px;
}
.list-enter-active, .list-leave-active {
  transition: all 0.3s;
}
.list-enter, .list-leave-to {
  opacity: 0;
} */

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
</style>