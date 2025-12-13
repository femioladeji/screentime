<script setup lang="ts">
const props = defineProps<{
  toggled: boolean
  disabled?: boolean
}>()

const emits = defineEmits<{
  (e: 'toggle', value: boolean): void
}>()

const onChange = (event: Event): void => {
  const target = event.target as HTMLInputElement
  emits('toggle', target.checked)
}
</script>

<template>
  <label class="switch__wrapper" :class="{ 'cursor-not-allowed': props.disabled }" role="switch">
    <input type="checkbox" :disabled="props.disabled" :checked="props.toggled" v-bind="$attrs" @change="onChange" />
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
  box-sizing: content-box;
  border: 1px solid var(--switch-border-color);
  transition: all 150ms ease-in-out;
  width: 42px;
  height: 24px;
  border-radius: 4px;
  margin-right: 8px;
}

.switch__wrapper .switch::before {
  position: absolute;
  left: 0;
  display: inline-block;
  border-radius: 4px;
  content: '';
  transition: inherit;
  height: 24px;
  width: 30px;
  box-shadow: 2px 0px 4px rgba(0, 0, 0, 0.1);
  content: 'Off';
  color: #FFFFFF;
  text-align: center;
  line-height: 24px;
  background-color: #828390;
}

input:checked~.switch::before {
  transform: translateX(12.6px);
  background-color: #3ED25E;
  content: 'On';
  color: white;
  text-align: center;
  line-height: 24px;
}

input:checked~.switch {
  /* background: var(--switch-checked-color); */
}
</style>
