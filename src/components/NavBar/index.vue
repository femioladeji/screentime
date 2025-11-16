<script setup lang="ts">


</script>

<style scoped>
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  border-bottom: 1px solid var(--nav_border);
  padding: 0 24px;
}

.menu {
  display: flex;
  height: 48px;

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 64px;
  }

  a.router-link-active {
    border-bottom: 1px solid var(--active_link);
  }

  a.router-link-active svg path {
    fill: var(--active_link);
  }
}
</style>

<template>
  <div class="nav">
    <div class="menu">
      <RouterLink to="/">
        Home
      </RouterLink>
      <RouterLink to="/app">
        Apps
      </RouterLink>
      <RouterLink to="/settings">
        Settings
      </RouterLink>
      <RouterLink to="/info">
        Info
      </RouterLink>
    </div>
    <!-- <theme-switcher /> -->
  </div>
</template>