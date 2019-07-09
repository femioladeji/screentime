<template>
  <div class="content">
    <div class="box settings">
        Theme settings
        <div class="theme-buttons">
            <button
              @click="setTheme('flash')"
              class="btn"
              :disabled="theme == 'flash'">
                Flash
            </button>
            <button
              @click="setTheme('batman')"
              class="btn"
              :disabled="theme == 'batman'">
                Batman
            </button>
        </div>
    </div>
  </div>
</template>

<script>
import utils, { SETTINGSKEY } from '../assets/js/utils';

export default {
  name: 'Settings',
  data() {
    return {
      theme: ''
    };
  },
  methods: {
    async setTheme(theme) {
      utils.saveConfiguration(SETTINGSKEY, { theme });
      this.theme = theme;
    }
  },
  async mounted() {
    const settings = await utils.getData(SETTINGSKEY);
    this.theme = settings.theme;
  }
};
</script>
