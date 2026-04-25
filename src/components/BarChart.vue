<script setup lang="ts">
import type { SiteConfigMap } from '@/Lib'
import * as utils from '@/Lib/Utils'
import type { ChartData, ChartOptions } from 'chart.js'
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js'
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps<{
  data: Record<string, number>
  config: SiteConfigMap
}>()

const chartData = computed((): ChartData<'bar', number[], string> => {
  const keys = Object.keys(props.data)
  const labels = keys.map((key) => utils.getConfiguredName(props.config, key))
  const data = keys.map((key) => Math.round((props.data[key] || 0) / 60))
  const backgroundColor = utils.getBarBackgroundColors(keys, props.config)

  return {
    labels,
    datasets: [
      {
        backgroundColor,
        data
      }
    ]
  }
})

const chartOptions = computed((): ChartOptions<'bar'> => {
  return {
    responsive: true,
    indexAxis: 'x' as const,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Screen Time (in minutes)'
      }
    },
  }
})
</script>

<template>
  <Bar :data="chartData" :options="chartOptions" />
</template>
