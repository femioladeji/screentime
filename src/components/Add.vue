<template>
  <div class="content">
    <h4 class="text-center">Add Website<h4>
    <form v-on:submit.prevent="add" class="form">
      <div>
        <input v-model="siteurl" type="url" placeholder="Site url (e.g http://google.com)" />
      </div>
      <div class="box center">
        <input type="submit" class="btn" value="Add" />
      </div>
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
        this.$router.push('addremove');
      }
    }
  }
};
</script>
