<script setup lang="ts">
const props = defineProps<{
    toggled: boolean;
    disabled?: boolean;
}>();

const emits = defineEmits<{
    (e: 'toggle', value: boolean): void;
}>();

const onChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emits('toggle', target.checked);
};
</script>
<template>
    <label class="switch__wrapper" :class="{ 'cursor-not-allowed': props.disabled }" role="switch">
        <input type="checkbox" :disabled="props.disabled" :checked="props.toggled" v-bind="$attrs" @change="onChange">
        <span class="switch"></span>
        <slot></slot>
    </label>
</template>

<style scoped>
.switch__wrapper {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.cursor-not-allowed {
    cursor: not-allowed;
}

.switch__wrapper input {
    position: absolute;
    width: 0px;
    height: 0px;
    opacity: 0;
}

.switch__wrapper .switch {
    position: relative;
    background: var(--switch-bg-color);
    transition: all 150ms ease-in-out;
    width: 25.6px;
    height: 16px;
    border-radius: 16px;
    margin-right: 8px;
}

.switch__wrapper .switch::before {
    position: absolute;
    left: 0;
    display: inline-block;
    background: var(--switch-fore-color);
    border-radius: 100%;
    content: "";
    transition: inherit;
    height: 12.8px;
    width: 12.8px;
    margin: 1.6px;
    box-shadow: 2px 0px 4px rgba(0, 0, 0, 0.1);
}

input:checked~.switch::before {
    transform: translateX(9.6px);
}

input:checked~.switch {
    background: var(--switch-checked-color);
}
</style>