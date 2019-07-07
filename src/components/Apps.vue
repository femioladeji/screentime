<template>
  <div class="content">
    <div class="apps-header">
      <stats active="2" idle="5" />
      <div class="action">
        <button class="btn">DISABLE ALL</button>
        <router-link to="/add" class="add"></router-link>
      </div>
    </div>
    <div class="app-list">
      <div class="row" v-for="(each, key) in sites" :key="key">
        <div>{{key}}</div>
        <div><img src="../assets/images/timer.png" />&nbsp; &nbsp; 00:10:21</div>
        <div class="actions">
          <switch-button @change="update" v-model="each.control"></switch-button>
          <router-link :to="{ name: 'Advanced', params: { name: key }}">
            <img src="../assets/images/edit.png" />
          </router-link>
          <img src="../assets/images/trash.png" />
        </div>
      </div>
    </div>
    <div class="box center">
      <button
        :disabled="saveStatus !== 0"
        type="button"
        @click="update"
        class="btn save">{{caption}}
      </button>
    </div>
  </div>
</template>

<script>
import Stats from './molecules/Stats';
import Switch from './atoms/Switch';
import utils, { CONFIGKEY } from '../assets/js/utils';

export default {
  name: 'Settings',
  components: {
    Stats,
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
        return this.saveStatus === 1 ? 'SAVING...' : 'SAVED';
      }
      return 'SAVE';
    },
    enableSave() {
      return this.saveStatus !== 0;
    }
  }
};
</script>
