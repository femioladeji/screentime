<template>
    <Bar :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import { computed } from 'vue'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, scales } from 'chart.js'
import type { ConfigType } from '@/assets/js/types';
import utils from '@/assets/js/utils';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps<{
    data: Record<string, number>
    config: ConfigType
}>()

const chartData = computed(() => {
    const labels = Object.keys(props.data);
    const data = Object.values(props.data).map(each => Math.ceil(each / 60));
    const backgroundColor = utils.getBarBackgroundColors(Object.keys(data), props.config);
    return {
        labels,
        datasets: [
            {
                backgroundColor,
                data,
            }
        ]
    }
})

const chartOptions = computed(() => {
    return {
        responsive: true,
        indexAxis: 'y' as const,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Screen Time (in minutes)'
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Minutes'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Sites'
                }
            }
        }
    }
})
</script>
