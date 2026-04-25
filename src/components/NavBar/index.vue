<script setup lang="ts">
</script>

<template>
  <nav class="nav">
    <div class="menu">
      <RouterLink to="/" v-slot="{ isActive }">
        <svg :class="['menu-icon', { active: isActive }]" width="20" height="20" viewBox="0 0 20 20" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12.5 17.5V10.8333C12.5 10.6123 12.4122 10.4004 12.2559 10.2441C12.0996 10.0878 11.8877 10 11.6667 10H8.33333C8.11232 10 7.90036 10.0878 7.74408 10.2441C7.5878 10.4004 7.5 10.6123 7.5 10.8333V17.5M2.5 8.33333C2.49994 8.09089 2.55278 7.85135 2.65482 7.63143C2.75687 7.41151 2.90566 7.2165 3.09083 7.06L8.92417 2.06083C9.22499 1.80659 9.60613 1.6671 10 1.6671C10.3939 1.6671 10.775 1.80659 11.0758 2.06083L16.9092 7.06C17.0943 7.2165 17.2431 7.41151 17.3452 7.63143C17.4472 7.85135 17.5001 8.09089 17.5 8.33333V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V8.33333Z"
            stroke="#B4B7E0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        Overview
      </RouterLink>
      <RouterLink to="/app" v-slot="{ isActive }">
        <svg :class="['menu-icon', { active: isActive }]" width="20" height="20" viewBox="0 0 20 20" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5.83366 16.6667H3.33366C2.89163 16.6667 2.46771 16.4911 2.15515 16.1785C1.84259 15.866 1.66699 15.442 1.66699 15V4.16667C1.66699 3.72464 1.84259 3.30072 2.15515 2.98816C2.46771 2.6756 2.89163 2.5 3.33366 2.5H6.58366C6.8624 2.49727 7.13737 2.56449 7.38341 2.69552C7.62945 2.82655 7.83869 3.01719 7.99199 3.25L8.66699 4.25C8.81875 4.48045 9.02535 4.6696 9.26824 4.80051C9.51114 4.93141 9.78273 4.99996 10.0587 5H16.667C17.109 5 17.5329 5.1756 17.8455 5.48816C18.1581 5.80072 18.3337 6.22464 18.3337 6.66667M13.3337 11.6667V13.3333L14.167 14.1667M18.3337 13.3333C18.3337 16.0948 16.0951 18.3333 13.3337 18.3333C10.5722 18.3333 8.33366 16.0948 8.33366 13.3333C8.33366 10.5719 10.5722 8.33334 13.3337 8.33334C16.0951 8.33334 18.3337 10.5719 18.3337 13.3333Z"
            stroke="#B4B7E0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        Manage Time
      </RouterLink>
      <RouterLink to="/settings" v-slot="{ isActive }">
        <svg :class="['menu-icon', { active: isActive }]" width="20" height="20" viewBox="0 0 20 20" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16.6663 5.83333H9.16634M11.6663 14.1667H4.16634M11.6663 14.1667C11.6663 15.5474 12.7856 16.6667 14.1663 16.6667C15.5471 16.6667 16.6663 15.5474 16.6663 14.1667C16.6663 12.7859 15.5471 11.6667 14.1663 11.6667C12.7856 11.6667 11.6663 12.7859 11.6663 14.1667ZM8.33301 5.83333C8.33301 7.21404 7.21372 8.33333 5.83301 8.33333C4.4523 8.33333 3.33301 7.21404 3.33301 5.83333C3.33301 4.45262 4.4523 3.33333 5.83301 3.33333C7.21372 3.33333 8.33301 4.45262 8.33301 5.83333Z"
            stroke="#B4B7E0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
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
}

.menu {
  display: flex;
  height: 52px;

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: var(--nav_color);
    padding: 0 16px;

    .menu-icon {
      margin-right: 10px;
      width: 20px;
      height: 20px;
      vertical-align: middle;
      display: inline-block;

      /* path {
        fill: none;
      } */
    }

    .menu-icon.active path {
      stroke: #767DE8;
    }
  }

  a.router-link-active {
    color: var(--nav_active_color);
    border-bottom: 1px solid var(--active_link);
  }

  /* a.router-link-active svg path {
    fill: var(--active_link);
  } */
}
</style>
