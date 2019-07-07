<template>
  <div id="app">
    <nav-bar />
    <router-view/>
  </div>
</template>

<script>
import NavBar from './components/molecules/NavBar';

export default {
  name: 'App',
  components: {
    NavBar
  }
};
</script>

<style>
  @import './assets/main.css';
</style>
