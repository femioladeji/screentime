<template>
  <div class="row">
    <div class="app-title">
      <div class="app-name">{{siteKey}}</div>
      <div class="app-url">{{details.url}}</div>
    </div>
    <div class="app-timings">
      <timer class="timer-icon" />
      {{formattedTime}}
    </div>
    <div class="site-actions">
      <switch-button :toggled="details.control" @toggle="update"></switch-button>
      <router-link :to="{ name: 'Advanced', params: { name: siteKey }}" class="edit">
        <edit />
      </router-link>
      <close @click="remove" />
    </div>
    <div class="active-border" />
  </div>
</template>

<script>
import SwitchButton from '../atoms/Switch';
import Close from '../atoms/Icons/Close';
import Edit from '../atoms/Icons/Edit';
import Timer from '../atoms/Icons/Timer';

export default {
  name: 'EachApp',
  components: {
    SwitchButton,
    Close,
    Edit,
    Timer
  },
  props: {
    details: {
      type: Object,
      required: true
    },
    siteKey: {
      type: String,
      required: true
    },
    time: {
      type: Number,
      required: false
    }
  },
  computed: {
    formattedTime() {
      if (!this.time) {
        return '00:00:00';
      }
      const hours = Math.floor(this.time / 3600).toString();
      const minutes = Math.floor((this.time % 3600) / 60).toString();
      const seconds = (this.time % 60).toString();
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    }
  },
  methods: {
    update() {
      this.$emit('update', this.siteKey, !this.details.control);
    },
    remove() {
      this.$emit('remove', this.siteKey);
    }
  }
};
</script>

<style scoped>
.row {
  display: flex;
  height: 48px;
  border-bottom: 1px solid #E0E0E0;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  position: relative;
}

.row > div:first-of-type {
  width: 35%;
}

.active-border {
  width: 4px;
  height: 48px;
  position: absolute;
  left: 0;
  top: 0;
  background: #8BA3F8;
  display: none;
}

.row:hover .active-border {
  display: block;
}

.app-name {
  font-size: 12px;
  text-transform: capitalize;
}

.app-url {
  color: #828282;
  font-size: 10px;
  text-transform: lowercase;
}

.app-timings {
  display: flex;
  align-items: center;
}

.app-timings .timer-icon {
  margin-right: 6px;
}

.site-actions {
  display: flex;
  align-items: center;
}

.site-actions img {
  cursor: pointer;
}

.site-actions .edit {
  margin: 0 16px 0 8px;
  display: inline-flex;
}
</style>
