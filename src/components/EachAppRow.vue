<script setup lang="ts">
import { computed } from 'vue';
import Switch from './SwitchInput.vue';

const props = defineProps<{
    siteKey: string;
    details: any;
    time: number;
}>();

const appTitle = props.details.title || props.siteKey;
const formattedTime = computed(() => {
    if (!props.time) {
        return '00:00:00';
    }
    const hours = Math.floor(props.time / 3600).toString();
    const minutes = Math.floor((props.time % 3600) / 60).toString();
    const seconds = (props.time % 60).toString();
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
});

const emits = defineEmits<{
    (e: 'update', appKey: string, value: boolean): void;
    (e: 'remove', appKey: string): void;
}>();

const update = () => {
    emits('update', props.siteKey, !props.details.control);
};

const remove = () => {
    emits('remove', props.siteKey);
}
</script>
<template>
    <div class="row">
        <div class="app-title">
            <div class="app-name">{{ appTitle }}</div>
            <div class="app-url">{{ details.url }}</div>
        </div>
        <div class="app-timings">
            <!-- <timer class="timer-icon" /> -->
            {{ formattedTime }}
        </div>
        <div class="site-actions">
            <Switch :toggled="details.control" @toggle="update"></Switch>
            <RouterLink :to="`/advanced/${siteKey}`" class="edit">
                Edit
            </RouterLink>
            <button class="remove-btn" @click="remove">
                Delete
            </button>
        </div>
        <div class="active-border"></div>
    </div>
</template>

<style scoped>
.row {
    display: flex;
    height: 48px;
    border-bottom: 1px solid #E0E0E0;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    position: relative;
}

.row>div:first-of-type {
    width: 35%;
}

.active-border {
    width: 4px;
    height: 48px;
    position: absolute;
    left: 0;
    top: 0;
    background: #8BA3F8;
    display: none;
}

.row:hover .active-border {
    display: block;
}

.app-name {
    font-size: 12px;
    text-transform: capitalize;
}

.app-url {
    color: #828282;
    font-size: 10px;
    text-transform: lowercase;
}

.app-timings {
    display: flex;
    align-items: center;
}

.app-timings .timer-icon {
    margin-right: 6px;
}

.site-actions {
    /* visibility: hidden; */
    display: flex;
    align-items: center;
}

.row:hover .app-timings svg path {
    fill: #333333;
}

body.dark-mode .row:hover .app-timings svg path {
    fill: #E0E0E0;
}

.row:hover .site-actions {
    /* visibility: visible; */
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