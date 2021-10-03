<template>
  <div id="app">
    <nav-bar />
    <router-view/>
  </div>
</template>

<script>
import Vue from 'vue';
import NavBar from './components/molecules/NavBar/index';

Vue.directive('click-outside', {
  bind: (el, binding, vnode) => {
    el.clickOutsideEvent = (event) => { // eslint-disable-line no-param-reassign
      if (!(el === event.target || el.contains(event.target))
        && !event.target.classList.contains('app-color')) {
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent);
  },
  unbind: (el) => {
    document.body.removeEventListener('click', el.clickOutsideEvent);
  }
});

export default {
  name: 'App',
  components: {
    NavBar
  },
  mounted() {
    if (this.$route.path === '/') {
      this.$router.push('home');
    }
  }
};
</script>

<style>
@import './assets/main.css';

:root {
  --bg: #FFFFFF;
  --nav_border: #F2F2F2;
  --active_link: #333333;

  --icon_default: #BDBDBD;
  --switch-bg-color: #BDBDBD;
  --switch-checked-color: #333333;
  --switch-fore-color: #FFFFFF;
  --text-color: #333333;
}

body.dark-mode {
  --bg: #333333;
  --nav_border: #4F4F4F;
  --active_link: #E0E0E0;

  --icon_default: #828282;
  --switch-bg-color: #828282;
  --switch-checked-color: #BDBDBD;
  --switch-fore-color: #FFFFFF;
  --text-color: #F2F2F2;
}

svg path {
  fill: var(--icon_default);
}

#app {
  width: 522px;
  background: var(--bg);
  color: var(--text-color);
}


</style>
