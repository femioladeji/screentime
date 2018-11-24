<template>
  <div class="content">
    <h4 class="text-center">Advanced settings for {{name}}</h4>
    <form class="form">
      <div class="box middle">
        <label>Daily Limit (minutes)</label>
        <input @keyup.enter="update" class="minute" @change="update" type="number" v-model="config.time" min="0" max="1440" />
      </div>
      <h4 class="text-center">Set Time frames to block {{name}}</h4>
      <div class="box middle">
        <label>Day</label>
        <select multiple v-model="daysChoosen" class="multiple">
          <option v-for="(each, key) in days" :key="key" :value="each">{{each}}</option>
        </select>
      </div>
      <div class="box middle">
        <label>From</label> <input v-model="from" type="time" />&nbsp;&nbsp;&nbsp;
        <label>To</label> <input v-model="to" type="time" />
      </div>
    </form>
    <div class="box center">
      <input type="button" class="btn" value="Add" :disabled="isTimeframeInValid" @click="addTimeFrame" />
    </div>
    <br/> <br />
    <table v-if="config.days" class="table">
      <thead>
        <tr>
          <th>Day</th>
          <th>From</th>
          <th>To</th>
          <th>Remove</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(value, day) in config.days">
          <template v-for="(timeframe, index) in value">
            <tr :key="index">
              <td v-if="index == 0" :rowspan="value.length">{{ day }}</td>
              <td>{{ timeframe.from }}</td>
              <td>{{ timeframe.to }}</td>
              <td class="action-icon" @click="remove(day, index)"><img src="images/remove-icon.png" /></td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
import utils, { CONFIGKEY } from '../assets/js/utils';

export default {
  name: 'Settings',
  data() {
    return {
      sites: {},
      name: '',
      config: {},
      daysChoosen: [],
      from: '',
      to: '',
      days: [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday'
      ]
    };
  },
  async mounted() {
    this.name = this.$route.params.name;
    const allSites = await utils.getData(CONFIGKEY);
    this.sites = allSites;
    this.config = this.sites[this.name];
  },
  methods: {
    async update() {
      this.config.control = true;
      this.sites[this.name] = this.config;
      utils.saveConfiguration(CONFIGKEY, this.sites);
    },

    addTimeFrame() {
      if (this.daysChoosen.length && this.from && this.to) {
        if (!this.config.days) {
          this.config.days = {};
        }
        this.daysChoosen.forEach(each => {
          if (!this.config.days[each]) {
            this.config.days[each] = [];
          }
          this.config.days[each].push({ from: this.from, to: this.to });
        });
        this.update();
        this.daysChoosen = [];
        this.from = '';
        this.to = '';
      }
    },

    remove(day, index) {
      console.log(this.config.days[day]);
      this.$delete(this.config.days[day], index);
      console.log(this.config);
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
