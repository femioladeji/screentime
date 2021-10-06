<template>
  <div class="theme-settings">
    <switch-button @toggle="update" :toggled="!isLightTheme">
      <span class="theme-title">{{ themeText }}</span>
    </switch-button>
    <light v-if="isLightTheme" class="theme-image" />
    <dark v-else class="theme-image" />
  </div>
</template>

<script>
import SwitchButton from '../../atoms/Switch';
import Dark from '../../atoms/Icons/Dark';
import Light from '../../atoms/Icons/Light';
import utils, { SETTINGSKEY } from '../../../assets/js/utils';

export default {
  name: 'ThemeSwitcher',
  components: {
    SwitchButton,
    Light,
    Dark
  },
  data() {
    return {
      theme: null
    };
  },
  computed: {
    isLightTheme() {
      return this.theme !== 'batman';
    },
    themeText() {
      return this.isLightTheme ? 'Sunny Bunny' : 'Night owl';
    }
  },
  methods: {
    async update() {
      this.theme = this.isLightTheme ? 'batman' : 'flash';
      this.setTheme(this.theme);
    },
    async setTheme(theme) {
      const body = document.querySelector('body');
      if (theme === 'batman') {
        body.classList.add('dark-mode');
      } else {
        body.classList.remove('dark-mode');
      }
      utils.saveConfiguration(SETTINGSKEY, { theme });
    }
  },
  async mounted() {
    const settings = await utils.getData(SETTINGSKEY);
    this.theme = settings.theme;
    if (settings.theme === 'batman') {
      document.querySelector('body').classList.add('dark-mode');
    }
  }
};
</script>

<style scoped>
.theme-settings {
  display: flex;
}

.theme-title {
  font-size: 10px;
}

.theme-image {
  margin-left: 10px;
}

.close {
  background: none;
  border: 0;
  margin-left: 36px;
  cursor: pointer;
}
</style>
