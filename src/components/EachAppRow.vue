<script setup lang="ts">
import { computed } from 'vue'
import Switch from './SwitchInput.vue'

const props = defineProps<{
  siteKey: string
  details: any
  time: number
}>()

const emits = defineEmits<{
  (e: 'update', appKey: string, value: boolean): void
  (e: 'remove', appKey: string): void
}>()

const update = (): void => emits('update', props.siteKey, !props.details.control)
const remove = (): void => emits('remove', props.siteKey)

const appTitle = props.details.title || props.siteKey
const formattedTime = computed((): string => {
  if (!props.time) {
    return '00:00:00'
  }
  const hours = Math.floor(props.time / 3600).toString()
  const minutes = Math.floor((props.time % 3600) / 60).toString()
  const seconds = (props.time % 60).toString()
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`
})
</script>

<template>
  <td>
    <div class="app-name">{{ appTitle }}</div>
    <div class="app-url">{{ details.url }}</div>
  </td>
  <td style="text-align: center;">
    40
  </td>
  <td style="text-align: center;">
    {{ formattedTime }}
  </td>
  <td>
    <Switch :toggled="details.control" @toggle="update"></Switch>
    <!-- <RouterLink :to="`/advanced/${siteKey}`" class="edit"> Edit </RouterLink>
    <button class="remove-btn" @click="remove">Delete</button> -->
  </td>
  <div class="active-border"></div>
</template>

<style scoped>
td {
  padding: 8px 16px;
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
}

body.dark-mode .row:hover .app-timings svg path {
  fill: #e0e0e0;
}

.site-actions img {
  cursor: pointer;
}

.site-actions .edit {
  margin: 0 16px 0 8px;
  display: inline-flex;
}

.remove {
  cursor: pointer;
}

.remove-btn {
  border: 0;
  background: none;
}
</style>
