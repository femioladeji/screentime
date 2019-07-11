<template>
  <div id="app">
    <nav-bar />
    <router-view/>
  </div>
</template>

<script>
import NavBar from './components/molecules/NavBar';
import utils, { SETTINGSKEY } from './assets/js/utils';

export default {
  name: 'App',
  components: {
    NavBar
  },
  async mounted() {
    const settings = await utils.getData(SETTINGSKEY);
    if (settings.theme === 'batman') {
      document.querySelector('body').classList.add('dark-mode');
    }
    // this.$router.push('home');
  }
};
</script>

<style>
  @import './assets/main.css';
</style>
