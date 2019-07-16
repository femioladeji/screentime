<template id="switch-button">
  <div class="switch-button-control">
    <div
      class="switch-button"
      :class="{ enabled: isEnabled }"
      @click="toggle">
        <div class="button"></div>
    </div>
    <div class="switch-button-label">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'isEnabled',
    event: 'toggle'
  },
  props: {
    isEnabled: Boolean
  },
  methods: {
    toggle() {
      this.$emit('toggle', !this.isEnabled);
    }
  }
};
</script>

<style>
/** switch button style **/
.switch-button-control {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.switch-button-control .switch-button {
  padding: 3px 5px;
  width: 50px;
  box-shadow: inset 0px 0px 2px 0px rgba(0, 0, 0, 0.33);
  background: #E0E0E0;
  border-radius: 1.5em;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
}
.switch-button-control .switch-button .button {
  height: 19px;
  width: 19px;
  border-radius: 19px;
  background: #828282;
  transition: all 0.3s ease-in-out;
}
.switch-button-control .switch-button.enabled {
  background-color: #C9F9DD;
  box-shadow: none;
}
.switch-button-control .switch-button.enabled .button {
  background: #27AE60;
  transform: translateX(19px);
}
.switch-button-control .switch-button-label {
  margin-left: 10px;
}
/** end of switch button style **/
</style>
