<template>
  <div class="content">
    <h3 class="">App Details {{name}}</h3>
    <form class="form">
      <div class="input-field">
        <label>Title (Add an app title)</label>
        <input type="text" disabled :value="name" />
      </div>
      <div class="box minute">
        <label>Daily Limit (minutes)</label>
        <input @keyup.enter="update" @change="update" type="number"
          v-model="config.time" min="0" max="1440" />
      </div>
      <h3>Advanced Settings</h3>
      <div>
        <div class="box middle day" v-for="(each, key) in daysChoosen" :key="key">
          <label class="checkbox">{{ each.name }}
            <input type="checkbox" v-model="daysChoosen[key].active" />
            <span class="checkmark"></span>
          </label>
          <div>From&nbsp;&nbsp;<input type="time" v-model="daysChoosen[key].from" /></div>
          <div>To&nbsp;&nbsp;<input type="time" v-model="daysChoosen[key].to" /></div>
        </div>
      </div>
      <input @click.prevent="addTimeFrame" type="submit" value="SAVE" class="btn save"/>
    </form>
  </div>
</template>

<script>
import utils, { CONFIGKEY, days } from '../assets/js/utils';

export default {
  name: 'Settings',
  data() {
    return {
      sites: {},
      name: '',
      config: {},
      daysChoosen: []
    };
  },
  async mounted() {
    this.name = this.$route.params.name;
    const allSites = await utils.getData(CONFIGKEY);
    this.sites = allSites;
    this.config = this.sites[this.name];
    days.forEach((eachDay) => {
      if (this.config.days && eachDay in this.config.days) {
        this.config.days[eachDay].forEach((timeFrame) => {
          this.daysChoosen.push({
            name: eachDay,
            from: timeFrame.from,
            to: timeFrame.to,
            active: true
          });
        });
      } else {
        this.daysChoosen.push({
          name: eachDay,
          active: false
        });
      }
    });
  },
  methods: {
    async update() {
      this.config.control = true;
      this.sites[this.name] = this.config;
      utils.saveConfiguration(CONFIGKEY, this.sites);
    },

    addTimeFrame() {
      this.config.days = {};
      this.daysChoosen.forEach(({
        active, name, from, to
      }) => {
        if (active) {
          if (!this.config.days[name]) {
            this.config.days[name] = [];
          }
          this.config.days[name].push({
            from,
            to
          });
        }
      });
      this.update();
    }
  },
  computed: {
    isTimeframeInValid() {
      return !(this.daysChoosen.length && this.from && this.to && this.to > this.from);
    }
  }
};
</script>
