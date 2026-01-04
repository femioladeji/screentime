<script setup lang="ts">
import HouseIcon from '../../assets/icons/house.svg';
import ClockIcon from '../../assets/icons/folder-clock.svg';
import SettingsIcon from '../../assets/icons/settings-2.svg';
</script>

<template>
  <nav class="nav">
    <div class="menu">
      <RouterLink to="/" v-slot="{ isActive }">
        <img :src="HouseIcon" :class="['menu-icon', { active: isActive }]" />
        Overview
      </RouterLink>
      <RouterLink to="/app" v-slot="{ isActive }">
        <img :src="ClockIcon" :class="['menu-icon', { active: isActive }]" />
        Manage Time
      </RouterLink>
      <RouterLink to="/settings" v-slot="{ isActive }">
        <img :src="SettingsIcon" :class="['menu-icon', { active: isActive }]" />
        Settings
      </RouterLink>
    </div>
    <!-- <theme-switcher /> -->
  </nav>
</template>

<style scoped>
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 52px;
  border-bottom: 1px solid var(--nav_border);
  padding: 0 24px;
}

.menu {
  display: flex;
  height: 52px;
  gap: 24px;

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--nav_color);

    .menu-icon {
      margin-right: 10px;
      width: 20px;
      height: 20px;
      vertical-align: middle;
      display: inline-block;
    }

    .menu-icon.active path {
      stroke: #767DE8;
    }
  }

  a.router-link-active {
    color: var(--nav_active_color);
    border-bottom: 1px solid var(--active_link);
  }

  a.router-link-active svg path {
    fill: var(--active_link);
  }
}
</style>
