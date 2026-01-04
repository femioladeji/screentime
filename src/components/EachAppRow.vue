<script setup lang="ts">
import { computed } from 'vue'
import Switch from './SwitchInput.vue'
import SettingsIcon from '@/assets/icons/site-edit.svg';
import type { SiteConfig } from '@/Lib';

const props = defineProps<{
  siteKey: string
  details: SiteConfig
  time: number
}>()

const emits = defineEmits<{
  (e: 'update', appKey: string, value: boolean): void
  (e: 'remove', appKey: string): void
}>()

const update = (): void => emits('update', props.siteKey, !props.details.control)
const remove = (): void => emits('remove', props.siteKey)

const appTitle = props.details.title || props.siteKey
const formatMinutesToHours = (minutes: number): string => {
  const hrs = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hrs}h ${mins}m`
}
const formattedTime = computed((): string => {
  if (!props.time) {
    return '00:00:00'
  }
  const hours = Math.floor(props.time / 3600).toString()
  const minutes = Math.floor((props.time % 3600) / 60).toString()
  const seconds = Math.round(props.time % 60).toString()
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`
})
</script>

<template>
  <td>
    <div class="app-name">{{ appTitle }}</div>
    <div class="app-url">{{ details.url }}</div>
  </td>
  <td style="text-align: center;">
    {{ formatMinutesToHours(details.time) }}
  </td>
  <td style="text-align: center;">
    {{ formattedTime }}
  </td>
  <td class="site-actions">
    <Switch :toggled="details.control" @toggle="update"></Switch>
    <RouterLink :to="`/advanced/${siteKey}`" class="edit">
      <img :src="SettingsIcon" />
    </RouterLink>
    <!-- <button class="remove-btn" @click="remove">Delete</button> -->
  </td>
</template>

<style scoped>
td {
  padding: 8px 16px;
  border: 1px solid #E2E2E2;
}

.app-name {
  text-transform: capitalize;
}

.app-url {
  color: #828282;
  font-size: 10px;
  text-transform: lowercase;
}

.site-actions {
  display: flex;
  align-items: center;
  /* border-color: #E2E2E2; */
}

body.dark-mode .row:hover .app-timings svg path {
  fill: #e0e0e0;
}

.site-actions img {
  cursor: pointer;
}

.site-actions .edit {
  height: 20px;
}

.remove {
  cursor: pointer;
}

.remove-btn {
  border: 0;
  background: none;
}
</style>
