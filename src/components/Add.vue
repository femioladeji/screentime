<template>
  <div class="content">
    <h4 class="text-center">Add Website<h4>
    <form v-on:submit.prevent="add" class="form">
      <div>
        <input v-model="sitename" type="text" placeholder="Site name" />
      </div>
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
      sitename: '',
      siteurl: ''
    };
  },
  methods: {
    async add() {
      console.log(this.sitename, this.siteurl);
      if (this.sitename && this.siteurl) {
        const allSites = await utils.getData(CONFIGKEY);
        allSites[this.sitename] = {
          control: false,
          time: 0,
          url: this.siteurl
        };
        console.log(allSites);
        await utils.saveConfiguration(CONFIGKEY, allSites);
        this.sitename = '';
        this.siteurl = '';
        this.$router.push('addremove');
      }
    }
  }
};
</script>
