<template>
  <div class="nav">
    <span class="title">SCREENTIME</span>
    <div class="menu">
      <router-link to="/home" class="icon">
        <div class="menu-drop">
          Home
        </div>
      </router-link>
      <router-link to="/app" class="icon">
        <div class="menu-drop">
          Apps
        </div>
      </router-link>
      <router-link to="/settings" class="icon">
        <div class="menu-drop">
          Settings
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavBar'
};
</script>
