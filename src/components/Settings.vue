<template>
  <div class="content">
    <table class="table">
      <thead>
        <tr>
          <th width="40%">Site</th>
          <th>Control</th>
          <th>Time allowed</th>
        </tr>
      </thead>
        <tr v-for="(each, key) in sites" :key="key">
          <td>{{key}}</td>
          <td><switch-button v-model="each.control"></switch-button></td>
          <td><input :disabled="!each.control" type="number" v-model="each.time" /></td>
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
import storage from '../assets/js/storage';

const KEY = 'sites';

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
    const allSites = await storage.getData(KEY);
    this.sites = allSites;
  },
  methods: {
    update() {
      storage.save(KEY, this.sites);
    }
  }
};
</script>
