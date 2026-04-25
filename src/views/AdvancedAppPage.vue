<script setup lang="ts">
import Collapsible from '@/components/Collapsible.vue'
import TimeBlocks from '@/components/TimeBlocks.vue'
import { type DailyTimeBlocks, type SiteConfig, type SiteConfigMap, CONFIG_KEY } from '@/Lib'
import * as utils from '@/Lib/Utils'
import { computed, onMounted, ref, toRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const config = ref<SiteConfig>()
const sites = ref<SiteConfigMap>()
const isSaving = ref(false)
const isCreateMode = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const hasUnsavedChanges = ref(false)

const generateRandomColor = (): string => {
  const randomValue = Math.floor(Math.random() * 0xffffff)
  return `#${randomValue.toString(16).padStart(6, '0')}`
}

const defaultRandomColor = ref(generateRandomColor())

const appName = ref(route.params.name as string)
const buttonCaption = computed(() => (isSaving.value ? 'Saving...' : 'Save'))
const dailyLimitInHours = computed(() => {
  if (!config.value?.time) return '0h 0m'
  const hours = Math.floor(config.value.time / 60)
  const minutes = config.value.time % 60
  return `${hours}h ${minutes}m`
})

onMounted(async (): Promise<void> => {
  const allSites = await utils.getData<SiteConfigMap>(CONFIG_KEY)
  sites.value = allSites || {}

  // Check if we're in create mode (no name param or route is /advanced-new)
  if (!route.params.name || route.path === '/advanced-new') {
    isCreateMode.value = true
    // Initialize with empty config
    config.value = {
      title: '',
      url: '',
      time: 60,
      control: true,
      color: defaultRandomColor.value,
      days: undefined
    }
  } else {
    // Check if config exists for this site
    const existingConfig = allSites[appName.value]
    if (!existingConfig) {
      // Redirect to app list if timer doesn't exist
      router.push('/app')
      return
    }
    config.value = {
      ...existingConfig,
      color: existingConfig.color || defaultRandomColor.value
    }
  }
})

// Track form changes
const markAsChanged = () => {
  hasUnsavedChanges.value = true
  successMessage.value = ''
}

// Normalize URL for consistent comparison
const normalizeUrl = (url: string): string => {
  try {
    const urlObj = new URL(url)
    // Remove trailing slash and convert to lowercase
    return urlObj.origin.toLowerCase() + urlObj.pathname.toLowerCase().replace(/\/$/, '')
  } catch {
    return url.toLowerCase().trim()
  }
}

const update = async (): Promise<void> => {
  errorMessage.value = ''
  successMessage.value = ''

  // Validate required fields
  if (!config.value?.title?.trim()) {
    errorMessage.value = 'Title is required'
    return
  }
  if (!config.value?.url?.trim()) {
    errorMessage.value = 'URL is required'
    return
  }

  // Validate URL format
  try {
    new URL(config.value.url)
  } catch {
    errorMessage.value = 'Please enter a valid URL (e.g., https://example.com)'
    return
  }

  isSaving.value = true

  // For create mode, use the title as the key
  const siteKey = isCreateMode.value ? config.value.title : appName.value

  // Check if site already exists in create mode (using normalized URLs)
  if (isCreateMode.value && sites.value) {
    const normalizedNewUrl = normalizeUrl(config.value.url)
    const existingKeys = Object.keys(sites.value)
    const urlExists = existingKeys.some(key => normalizeUrl(key) === normalizedNewUrl)

    if (urlExists) {
      errorMessage.value = 'A timer for this URL already exists'
      isSaving.value = false
      return
    }
  }

  config.value = {
    ...(config.value as SiteConfig),
    control: true
  }
  sites.value = {
    ...sites.value,
    [siteKey]: toRaw(config.value)
  }
  await utils.saveConfiguration(CONFIG_KEY, sites.value)

  setTimeout(() => {
    isSaving.value = false
    hasUnsavedChanges.value = false
    if (isCreateMode.value) {
      successMessage.value = 'Timer created successfully!'
      // Navigate back to app list after successful creation
      setTimeout(() => router.push('/app'), 1000)
    } else {
      successMessage.value = 'Changes saved successfully!'
      setTimeout(() => successMessage.value = '', 3000)
    }
  }, 1500)
}

const updateDaysBlocks = async (timeBlocks: DailyTimeBlocks): Promise<void> => {
  config.value = {
    ...(config.value as SiteConfig),
    days: timeBlocks
  }
  update()
}
</script>

<template>
  <main>
    <div class="content">
      <div v-if="config" class="advanced-app-settings">
        <div class="page-header">
          <div class="page-title">
            <span class="page-title-caption">{{ isCreateMode ? 'Add New Timer ⏱️' : 'Edit Timer ⚙️' }}</span>
            <span v-if="!isCreateMode" class="page-subtitle">{{ config.title }}</span>
          </div>
          <div class="page-header-actions">
            <div v-if="successMessage" class="success-message header-success-message">
              ✓ {{ successMessage }}
            </div>
            <RouterLink to="/app" class="close-link">← Back to List</RouterLink>
          </div>
        </div>
        <div class="modal-content">
          <collapsible :open="true">
            <template #title>
              <h3 class="collapsible-title">Basic</h3>
            </template>
            <form class="form" @submit.prevent="update">
              <div class="input-field">
                <label>Title <span class="italize">(A name or description of the app)</span></label>
                <input v-model="config.title" type="text" required @input="markAsChanged" />
              </div>
              <div class="input-field">
                <label>URL <span class="italize">(example: https://www.some-app-title.com)</span></label>
                <input type="text" v-model="config.url" required @input="markAsChanged" />
              </div>
              <div v-if="errorMessage" class="error-message">
                {{ errorMessage }}
              </div>
              <div class="input-field">
                <label>Daily Limit <span class="italize">(in minutes)</span></label>
                <input v-model="config.time" type="number" min="0" max="1440" @input="markAsChanged" />
                <span class="input-helper">≈ {{ dailyLimitInHours }}</span>
              </div>
              <div class="save-section box between">
                <div class="color-field">
                  <label for="timer-color">Color</label>
                  <div class="color-input-wrap">
                    <input id="timer-color" v-model="config.color" type="color" class="color-input"
                      aria-label="Timer color" @input="markAsChanged" />
                    <span class="color-value">{{ config.color || defaultRandomColor }}</span>
                  </div>
                </div>
                <button type="submit" class="btn dark save-btn" :disabled="isSaving">
                  <save-icon class="save-icon" />{{ buttonCaption }}
                </button>
              </div>
            </form>
          </collapsible>
          <collapsible :open="true" class="advanced-section">
            <template #title>
              <h3 class="collapsible-title">Advanced (optional)</h3>
            </template>
            <div>
              <p class="advanced-more">Advanced setting lets you choose and add custom time blocks to days of the week
              </p>
              <TimeBlocks :configDays="config.days" :isSaving="isSaving" @updateDaysBlocks="updateDaysBlocks" />
            </div>
          </collapsible>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  background: var(--bg);
  color: var(--text-color);
  min-height: 100vh;
}

.content {
  padding: 24px 32px;
}

.advanced-app-settings {
  background: var(--bg);
  color: var(--text-color);
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--nav_border);
}

.page-title {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-title-caption {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
}

.page-subtitle {
  font-size: 13px;
  color: #828282;
}

.close-link {
  color: #767DE8;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: opacity 0.2s;
}

.close-link:hover {
  opacity: 0.8;
}

.modal-content {
  max-height: 450px;
  overflow-y: auto;
  padding-right: 10px;
}

.collapsible-title {
  font-size: 16px;
  font-weight: 600;
}

.input-field {
  margin-top: 16px;
}

.input-field label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-color);
}

.input-field input {
  width: 100%;
  color: var(--text-color);
  font-family: 'Inter', sans-serif;
  padding: 10px 14px;
  border: 1px solid #E0E0E0;
  border-radius: 6px;
  font-size: 14px;
  background-color: var(--bg);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-field input:focus {
  outline: none;
  border-color: #767DE8;
  box-shadow: 0 0 0 3px rgba(118, 125, 232, 0.1);
}

.input-field input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background-color: #f5f5f5;
  border-color: #e8e8e8;
}

.save-section {
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.color-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.color-field label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-color);
}

.color-input-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-input {
  width: 44px;
  height: 32px;
  border: 1px solid #E0E0E0;
  border-radius: 6px;
  background: transparent;
  padding: 2px;
  cursor: pointer;
}

.color-input::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-input::-webkit-color-swatch {
  border: none;
  border-radius: 4px;
}

.color-value {
  font-size: 12px;
  color: #828282;
  letter-spacing: 0.2px;
}

.save-section .save-btn {
  background-color: #767DE8;
  color: #FFFFFF;
  border: none;
  padding: 10px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.2s;
}

.save-section .save-btn:hover:not(:disabled) {
  background-color: #5f66d6;
}

.save-section .save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.advanced-section {
  margin-top: 28px;
}

.advanced-more {
  margin-top: 12px;
  margin-bottom: 16px;
  font-size: 13px;
  color: #828282;
  line-height: 1.5;
}

.error-message {
  color: #e74c3c;
  font-size: 13px;
  margin-top: 10px;
  padding: 8px 12px;
  background-color: #fee;
  border-left: 4px solid #e74c3c;
  border-radius: 4px;
  font-weight: 500;
}

.success-message {
  color: #27ae60;
  font-size: 13px;
  margin-top: 10px;
  padding: 8px 12px;
  background-color: #eafaf1;
  border-left: 4px solid #27ae60;
  border-radius: 4px;
  font-weight: 500;
}

.header-success-message {
  margin-top: 0;
  white-space: nowrap;
}

.input-helper {
  display: block;
  font-size: 12px;
  color: #828282;
  margin-top: 4px;
  font-style: italic;
}
</style>
