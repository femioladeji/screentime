<template>
  <div class="menu">
    <router-link to="/home" class="menu-link">
      <icon-overview />
    </router-link>
    <router-link to="/app" class="menu-link">
      <icon-apps />
    </router-link>
    <router-link to="/settings" class="menu-link">
      <icon-settings />
    </router-link>
  </div>
</template>

<script>
import IconOverview from '../../atoms/Icons/Overview';
import IconApps from '../../atoms/Icons/Apps';
import IconSettings from '../../atoms/Icons/Settings';

export default {
  name: 'Links',
  components: {
    IconOverview,
    IconApps,
    IconSettings
  }
};
</script>

<style>
.menu {
  display: flex;
  height: 48px;
}

.menu-link {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 64px;
}

.menu-link.router-link-active {
  border-bottom: 1px solid var(--active_link);
}

.menu-link.router-link-active svg path {
  fill: var(--active_link);
}
</style>
