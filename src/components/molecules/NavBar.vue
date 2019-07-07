<template>
  <div class="nav">
    <span class="title">SCREENTIME</span>
    <div class="menu">
      <router-link to="/home" class="icon" />
      <router-link to="/app" class="icon" />
      <router-link to="/settings" class="icon" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavBar'
};
</script>
