<template>
  <div class="content">
    <BackButton route="/app" />
    <h3>Add Website</h3>
    <form v-on:submit.prevent="add" class="form">
      <div class="input-field">
        <label>Site url (e.g http://google.com)</label>
        <input v-model="siteurl" type="url" />
      </div>
      <button type="submit" class="btn dark save">Add</button>
    </form>
  </div>
</template>

<script>
import utils, { CONFIGKEY } from '../assets/js/utils';
import BackButton from './molecules/BackButton';

export default {
  components: { BackButton },
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
