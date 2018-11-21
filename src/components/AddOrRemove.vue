<template>
  <div class="content">
    <table class="table">
      <tbody>
        <tr v-for="(each, key) in sites" :key="key">
          <td @click="remove(key)"><img src="images/remove-icon.png" /></td>
          <td>{{key}}</td>
        </tr>
      </tbody>
    </table>
    <div class="box center">
      <button @click="gotoNew" class="btn">Add New</button>
    </div>
  </div>
</template>

<script>
import utils, { CONFIGKEY } from '../assets/js/utils';

export default {
  name: 'AddOrRemove',
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
    remove(key) {
      this.$delete(this.sites, key);
      utils.saveConfiguration(CONFIGKEY, this.sites);
    },
    gotoNew() {
      this.$router.push('add');
    }
  }
};
</script>
