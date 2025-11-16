<script setup lang="ts">
import { dayOfTheWeekMap, type ConfigType, type TimerType } from '@/assets/js/types';
import utils, { CONFIGKEY, DATAKEY } from '@/assets/js/utils';
import BarChart from '@/components/Barchart.vue';
import { onMounted, ref } from 'vue';

const timerDataForCurrentDay = ref<Record<string, number>>({});
const sitesConfiguration = ref<ConfigType>({});
const loaded = ref(false);

onMounted(async () => {
  const currentDayOfWeek = dayOfTheWeekMap[new Date().getDay()];
  const timerData = await utils.getData<TimerType>(DATAKEY);
  const configData = await utils.getData<ConfigType>(CONFIGKEY);
  timerDataForCurrentDay.value = timerData?.[currentDayOfWeek!] || {};
  sitesConfiguration.value = configData || {};
  loaded.value = true;
});
</script>

<template>
  <main>
    <BarChart v-if="loaded" :data="timerDataForCurrentDay" :config="sitesConfiguration" />
  </main>
</template>
