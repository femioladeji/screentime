<template>
  <div id="app">
    <h3 class="title text-center">SCREENTIME</h3>
    <router-view/>
    <Footer />
  </div>
</template>

<script>
import Footer from './components/Footer';

export default {
  name: 'App',
  components: {
    Footer
  }
};
</script>

<style>
  @import './assets/main.css';
</style>
