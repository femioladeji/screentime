<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { type ConfigType, type ConfigProperties, daysOfTheWeekEnum } from '@/assets/js/types';
import utils, { CONFIGKEY } from '@/assets/js/utils';
import Collapsible from '../components/Collapsible.vue';
import TimeBlocks from '@/components/TimeBlocks.vue';

const route = useRoute();

const config = ref<ConfigProperties>();
const sites = ref<ConfigType>();
const appName = route.params.name;
const isSaving = ref(false);
const buttonCaption = computed(() => isSaving.value ? 'Saving...' : 'Save');

onMounted(async () => {
    const allSites = await utils.getData<ConfigType>(CONFIGKEY);
    sites.value = allSites || {};
    config.value = allSites[appName as string]!;
});

const update = async () => {
    isSaving.value = true;
    config.value = {
        ...config.value as ConfigProperties,
        control: true,
    };
    sites.value = {
        ...sites.value,
        [appName as string]: config.value
    }
    await utils.saveConfiguration(CONFIGKEY, sites.value);
    setTimeout(() => {
        isSaving.value = false;
    }, 1500);
}

const updateDaysBlocks = async (timeBlocks: Record<daysOfTheWeekEnum, Array<{ from: string; to: string }>>) => {
    config.value = {
        ...config.value as ConfigProperties,
        days: timeBlocks
    };
    update();
}
</script>
<template>
    <div>
        <div class="modal-bg"></div>
        <div v-if="config" class="advanced-app-settings">
            <div class="modal-header">
                <RouterLink to="/app">Close</RouterLink>
            </div>
            <div class="modal-content">
                <collapsible :open="true">
                    <template #title>
                        <h3 class="collapsible-title">Basic</h3>
                    </template>
                    <form class="form" @submit.prevent="update">
                        <div class="input-field">
                            <label>Title <span class="italize">(A name or description of the app)</span></label>
                            <input v-model="config.title" type="text" />
                        </div>
                        <div class="input-field">
                            <label>URL <span class="italize">(example: https://www.some-app-title.com)</span></label>
                            <input type="text" disabled :value="config.url" />
                        </div>
                        <div class="input-field">
                            <label>Daily Limit <span class="italize">(in minutes)</span></label>
                            <input v-model="config.time" type="number" min="0" max="1440" />
                        </div>
                        <div class="save-section box between">
                            <color-picker v-model="config.color" />
                            <button type="submit" class="btn dark save-btn" :disabled="isSaving">
                                <save-icon class="save-icon" />{{ buttonCaption }}
                            </button>
                        </div>
                    </form>
                </collapsible>
                <collapsible :open="true" class="advanced-section">
                    <template #title>
                        <h3 class="collapsible-title">Advanced</h3>
                    </template>
                    <div>
                        <p class="advanced-more">
                            Advanced setting lets you choose and add
                            custom time blocks to days of the week
                        </p>
                        <TimeBlocks :configDays="config.days" :isSaving="isSaving"
                            @updateDaysBlocks="updateDaysBlocks" />
                    </div>
                </collapsible>
            </div>
        </div>
    </div>
</template>

<style scoped>
.advanced-app-settings {
    background: var(--bg);
    color: var(--text-color);
    z-index: 1;
    position: relative;
    border-radius: 8px;
    margin: 0 20px 20px 20px;
}

.modal-header {
    display: flex;
    justify-content: flex-end;
    height: 50px;
    align-items: center;
}

.modal-content {
    max-height: 482px;
    overflow-y: auto;
    padding: 0px 40px 50px;
}

.modal-header .close-advanced {
    height: 16px;
    width: 16px;
    margin-right: 20px;
}

.close-advanced path {
    fill: var(--text-color);
}

.advanced-header {
    margin-bottom: 8px;
}

.collapsible-title {
    font-size: 16px;
}

.save-section {
    margin-top: 24px;
}

.save-section .save-btn {
    padding: 7px 20px;
}

.advanced-section {
    margin-top: 32px;
}

.advanced-more {
    margin-top: 12px;
    font-size: 12px;
    color: #828282;
}

.modal-bg {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
}
</style>