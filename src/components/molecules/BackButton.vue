<template>
  <router-link :to="route" class="breadcrumb">
    <span>&laquo; Back</span>
  </router-link>
</template>

<script>
export default {
  props: {
    route: {
      type: String,
      required: true
    }
  }
};
</script>
