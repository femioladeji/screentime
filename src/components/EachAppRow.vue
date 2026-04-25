<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Switch from './SwitchInput.vue'
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

const router = useRouter()
const showDropdown = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const update = (): void => emits('update', props.siteKey, !props.details.control)
const remove = (): void => {
  if (confirm(`Are you sure you want to delete the timer for "${appTitle}"?`)) {
    emits('remove', props.siteKey)
    showDropdown.value = false
  }
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const goToSettings = () => {
  showDropdown.value = false
  router.push(`/advanced/${props.siteKey}`)
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

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
    <div class="actions-menu" ref="dropdownRef">
      <button class="menu-button" @click="toggleDropdown">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="4" r="1.5" fill="currentColor" />
          <circle cx="10" cy="10" r="1.5" fill="currentColor" />
          <circle cx="10" cy="16" r="1.5" fill="currentColor" />
        </svg>
      </button>
      <div v-if="showDropdown" class="dropdown-menu">
        <button class="dropdown-item" @click="goToSettings">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"
              stroke="currentColor" stroke-width="1.5" />
            <path
              d="M13 8C13 8.55 12.96 9.08 12.88 9.58L14.25 10.63C14.37 10.72 14.41 10.89 14.33 11.02L13.08 13.23C13 13.36 12.83 13.41 12.7 13.36L11.09 12.71C10.73 13 10.33 13.24 9.89 13.42L9.64 15.15C9.62 15.29 9.5 15.39 9.36 15.39H6.86C6.72 15.39 6.6 15.29 6.58 15.15L6.33 13.42C5.89 13.24 5.49 13 5.13 12.71L3.52 13.36C3.39 13.41 3.22 13.36 3.14 13.23L1.89 11.02C1.81 10.89 1.85 10.72 1.97 10.63L3.34 9.58C3.26 9.08 3.22 8.55 3.22 8C3.22 7.45 3.26 6.92 3.34 6.42L1.97 5.37C1.85 5.28 1.81 5.11 1.89 4.98L3.14 2.77C3.22 2.64 3.39 2.59 3.52 2.64L5.13 3.29C5.49 3 5.89 2.76 6.33 2.58L6.58 0.85C6.6 0.71 6.72 0.61 6.86 0.61H9.36C9.5 0.61 9.62 0.71 9.64 0.85L9.89 2.58C10.33 2.76 10.73 3 11.09 3.29L12.7 2.64C12.83 2.59 13 2.64 13.08 2.77L14.33 4.98C14.41 5.11 14.37 5.28 14.25 5.37L12.88 6.42C12.96 6.92 13 7.45 13 8Z"
              stroke="currentColor" stroke-width="1.5" />
          </svg>
          Edit Settings
        </button>
        <button class="dropdown-item delete" @click="remove">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 4H13M5.5 4V3C5.5 2.44772 5.94772 2 6.5 2H9.5C10.0523 2 10.5 2.44772 10.5 3V4M12 4V13C12 13.5523 11.5523 14 11 14H5C4.44772 14 4 13.5523 4 13V4H12Z"
              stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          Delete
        </button>
      </div>
    </div>
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
  gap: 12px;
  position: relative;
}

/* body.dark-mode .row:hover .app-timings svg path {
  fill: #e0e0e0;
} */

.actions-menu {
  position: relative;
}

.menu-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: #828282;
  transition: all 0.2s;
}

.menu-button:hover {
  background: rgba(118, 125, 232, 0.1);
  color: #767DE8;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: calc(100% + 4px);
  background: var(--bg);
  border: 1px solid #E0E0E0;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 160px;
  z-index: 1000;
  overflow: hidden;
}

body.dark-mode .dropdown-menu {
  border-color: #828282;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 14px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-color);
  text-align: left;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background: rgba(118, 125, 232, 0.1);
}

.dropdown-item.delete {
  color: #e74c3c;
}

.dropdown-item.delete:hover {
  background: rgba(231, 76, 60, 0.1);
}

.dropdown-item svg {
  flex-shrink: 0;
}

.remove {
  cursor: pointer;
}

.remove-btn {
  border: 0;
  background: none;
}
</style>
