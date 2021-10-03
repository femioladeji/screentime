<template>
  <div class="box between colorpicker">
    <button
      type="button"
      class="app-color"
      :style="{'background': value}"
      @click="togglePopup">
    </button>
    Choose Color
    <div v-show="showPopup" class="color-list" v-click-outside="hidePopup">
      <button
        v-for="eachColor in colors"
        :key="eachColor"
        :style="{'background': eachColor}"
        type="button"
        @click="chooseColor(eachColor)"
      />
    </div>
  </div>
</template>

<script>
import { ALLCOLORS } from '../../../assets/js/utils';

export default {
  name: 'ColorPicker',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      showPopup: false
    };
  },
  computed: {
    colors() {
      return ALLCOLORS;
    }
  },
  methods: {
    chooseColor(color) {
      this.showPopup = false;
      this.$emit('change', color);
    },
    togglePopup() {
      this.showPopup = !this.showPopup;
    },
    hidePopup() {
      this.showPopup = false;
    }
  }
};
</script>

<style scoped>
.colorpicker {
  font-size: 12px;
  position: relative;
}

.colorpicker .app-color {
  border: none;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  margin-right: 12px;
  cursor: pointer;
}

.color-list {
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  display: grid;
  justify-content: space-between;
  width: 167px;
  padding: 14px;
  position: absolute;
  left: 0;
  top: 30px;
  z-index: 1;
  background: var(--bg);
  grid-template-columns: repeat(5, 18px);
  row-gap: 14px;
}

.dark-mode .color-list {
  border-color: #828282;
}

.color-list button {
  width: 18px;
  height: 18px;
  border: none;
  border-radius: 9px;
  background: none;
  cursor: pointer;
}

.color-list button:hover {
  border: 3px solid #E0E0E0;
}
</style>
