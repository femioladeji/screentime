<script setup lang="ts">
import BarChart from '@/components/BarChart.vue'
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
    <div class="content">
      <div class="apps-header">
        <div class="page-title">
          <span class="page-title-caption">Activity Overview🔥</span>
          <span>Here's the analysis of your screen time</span>
        </div>
      </div>

      <BarChart v-if="loaded" :data="timerDataForCurrentDay" :config="sitesConfiguration" />
    </div>
  </main>
</template>
