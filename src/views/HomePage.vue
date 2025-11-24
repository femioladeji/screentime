<script setup lang="ts">
import BarChart from '@/Components/BarChart.vue'
import { CONFIG_KEY, DATA_KEY, daysOfTheWeek, type SiteConfigMap, type Timer } from '@/Lib'
import * as utils from '@/Lib/Utils'
import { onMounted, ref } from 'vue'

const timerDataForCurrentDay = ref<Record<string, number>>({})
const sitesConfiguration = ref<SiteConfigMap>({})
const loaded = ref(false)

onMounted(async (): Promise<void> => {
  const currentDayOfWeek = daysOfTheWeek[new Date().getDay()]
  const timerData = await utils.getData<Timer>(DATA_KEY)
  const configData = await utils.getData<SiteConfigMap>(CONFIG_KEY)
  timerDataForCurrentDay.value = timerData?.[currentDayOfWeek!] || {}
  sitesConfiguration.value = configData || {}
  loaded.value = true
})
</script>

<template>
  <main>
    <BarChart v-if="loaded" :data="timerDataForCurrentDay" :config="sitesConfiguration" />
  </main>
</template>
