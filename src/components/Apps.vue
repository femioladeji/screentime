<template>
  <div class="content">
    <div class="apps-header">
      <stats :active="active" :idle="idle" />
      <div class="action">
        <button class="btn" @click="disableAll">DISABLE ALL</button>
        <router-link to="/add" class="add"></router-link>
      </div>
    </div>
    <div class="app-list">
      <div class="row" v-for="(each, key) in sites" :key="key">
        <div>{{key}}</div>
        <div><img src="../assets/images/timer.png" />&nbsp; &nbsp; {{ formatTime(key) }}</div>
        <div class="actions">
          <switch-button @toggle="update" v-model="each.control"></switch-button>
          <router-link :to="{ name: 'Advanced', params: { name: key }}">
            <img src="../assets/images/edit.png" />
          </router-link>
          <img @click="remove(key)" src="../assets/images/trash.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Stats from './molecules/Stats';
import Switch from './atoms/Switch';
import utils, { CONFIGKEY, DATAKEY } from '../assets/js/utils';

export default {
  name: 'Settings',
  components: {
    Stats,
    'switch-button': Switch
  },
  data() {
    return {
      sites: {},
      time: {},
      saveStatus: 0
    };
  },
  async mounted() {
    [this.sites, this.time] = await Promise.all([utils.getData(CONFIGKEY), utils.getData(DATAKEY)]);
    const currentDate = utils.getCurrentDate();
    this.time = this.time[currentDate] || {};
  },
  methods: {
    async update(type) {
      await utils.saveConfiguration(CONFIGKEY, this.sites);
    },
    formatTime(site) {
      if (!this.time[site]) {
        return '00:00:00';
      }
      let hours = Math.floor(this.time[site] / 3600).toString();
      let minutes = Math.floor((this.time[site] % 3600) / 60).toString();
      let seconds = (this.time[site] % 60).toString();
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    },
    disableAll() {
      for (const each in this.sites) {
        this.sites[each].control = false;
      }
      this.update();
    },
    remove(key) {
      this.$delete(this.sites, key);
      this.update();
    }
  },
  computed: {
    active() {
      const keys = Object.keys(this.sites);
      return keys.filter(each => this.sites[each].control).length;
    },
    idle() {
      const keys = Object.keys(this.sites);
      return keys.filter(each => !this.sites[each].control).length;
    }
  }
};
</script>
