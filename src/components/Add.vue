<template>
  <div class="content">
    <router-link to="/app" class="breadcrumb">
      <span>&laquo; Back</span>
    </router-link>
    <h3>Add Website</h3>
    <form v-on:submit.prevent="add" class="form">
      <div class="input-field">
        <label>Site url (e.g http://google.com)</label>
        <input v-model="siteurl" type="url" />
      </div>
      <button type="submit" class="btn save">Add</button>
    </form>
  </div>
</template>

<script>
import utils, { CONFIGKEY } from '../assets/js/utils';

export default {
  name: 'Add',
  data() {
    return {
      siteurl: ''
    };
  },
  methods: {
    async add() {
      if (this.siteurl) {
        const allSites = await utils.getData(CONFIGKEY);
        const name = utils.getName(this.siteurl);
        allSites[name.toLowerCase()] = {
          control: false,
          time: 0,
          url: this.siteurl
        };
        await utils.saveConfiguration(CONFIGKEY, allSites);
        this.siteurl = '';
        this.$router.push('app');
      }
    }
  }
};
</script>
