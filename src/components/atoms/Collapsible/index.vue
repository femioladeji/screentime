<template>
  <div>
    <div
      class="collapsible-head"
      :class="{ 'is-opened': show }"
      @click="toggle"
    >
      <div class="title box between">
        <slot name="title" />
        <!-- <p>{{title}}</p> -->
        <!-- <div class="line" /> -->
        <arrow />
      </div>
    </div>
    <transition name="slide">
      <div v-if="show">
        <slot />
      </div>
    </transition>
  </div>
</template>

<script>
import Arrow from '../Icons/Arrow';

export default {
  name: 'Collapsible',
  components: {
    Arrow
  },
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: this.open
    };
  },
  methods: {
    toggle() {
      this.show = !this.show;
    }
  }
};
</script>

<style>
.collapsible-head svg {
  transform: rotate(180deg);
}

.collapsible-head.is-opened svg {
  transform: rotate(0deg);
}

.collapsible-head {
  cursor: pointer;
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.collapsible-head .title {
  width: 100%;
  font-size: 16px;
}

.collapsible-head .line {
  height: 1px;
  width: 300px;
  background: var(--nav_border);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease-in-out;
  /* @apply transition-all duration-500 ease-in-out; */
}

.slide-enter-to,
.slide-leave {
  max-height: 100vh;
  overflow: hidden;
}

.slide-enter,
.slide-leave-to {
  overflow: hidden;
  max-height: 0;
}
</style>
