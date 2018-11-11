<template>
  <div class="content">
    <table class="table">
      <thead>
        <tr>
          <th width="40%">Site</th>
          <th>Control</th>
          <th>Time allowe (minutes)</th>
        </tr>
      </thead>
        <tr v-for="(each, key) in sites" :key="key">
          <td>{{key}}</td>
          <td><switch-button @change="update" v-model="each.control"></switch-button></td>
          <td>
            <input
              @change="update"
              :disabled="!each.control"
              type="number"
              v-model="each.time" />
          </td>
        </tr>
      <tbody>
        <tr>
        </tr>
      </tbody>
    </table>
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
      sites: {}
    };
  },
  async mounted() {
    const allSites = await utils.getData(CONFIGKEY);
    this.sites = allSites;
  },
  methods: {
    update() {
      utils.saveConfiguration(CONFIGKEY, this.sites);
    }
  }
};
</script>
