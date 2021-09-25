<template>
  <div class="nav">
    <Links />
    <div class="action">
        <theme-switcher />
    </div>
  </div>
</template>

<script>
import Links from './Links';
import ThemeSwitcher from './ThemeSwitcher';

export default {
  name: 'NavBar',
  components: {
    Links,
    ThemeSwitcher
  }
};
</script>

<style>
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  border-bottom: 1px solid var(--nav_border);
}

.action {
  display: flex;
}
</style>
