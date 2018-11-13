<template>
  <div class="content">
    <table class="table">
      <thead>
        <tr>
          <th width="30%">Site</th>
          <th>Control</th>
          <th width="40%">Time allowed (mins)</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(each, key) in sites" :key="key">
          <td>{{key}}</td>
          <td><switch-button @change="update" v-model="each.control"></switch-button></td>
          <td>
            <input
              :disabled="!each.control"
              type="number"
              v-model.number="each.time" />
          </td>
        </tr>
      </tbody>
    </table>
    <div class="box center">
      <button
        :disabled="saveStatus !== 0"
        type="button"
        @click="update"
        class="btn">{{caption}}
      </button>
    </div>
  </div>
</template>

<script>
import Switch from './switch';
import utils, { CONFIGKEY } from '../assets/js/utils';

export default {
  name: 'Settings',
  components: {
    'switch-button': Switch
  },
  data() {
    return {
      sites: {},
      saveStatus: 0
    };
  },
  async mounted() {
    const allSites = await utils.getData(CONFIGKEY);
    this.sites = allSites;
  },
  methods: {
    async update() {
      this.saveStatus = 1;
      await utils.saveConfiguration(CONFIGKEY, this.sites);
      this.saveStatus = 2;
      setTimeout(() => {
        this.saveStatus = 0;
      }, 1000);
    }
  },
  computed: {
    caption() {
      if (this.saveStatus) {
        return this.saveStatus === 1 ? 'Saving...' : 'Saved';
      }
      return 'Save';
    },
    enableSave() {
      return this.saveStatus !== 0;
    }
  }
};
</script>
