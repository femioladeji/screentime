<template>
  <div>
    <router-view v-if="isPageUnlocked"></router-view>
    <div v-else class="content">
      <form v-on:submit.prevent="unlockPage" class="form">
        <div class="input-field">
          <label>Enter password to edit configuration</label>
          <input v-model="password" type="password" />
        </div>
        <p v-if="errorMessage" class="text-center text-error">{{ errorMessage }}</p>
        <button type="submit" class="btn save">Continue</button>
      </form>
    </div>
  </div>
</template>

<script>
import bcrypt from 'bcryptjs';
import utils, { PASSWORDKEY } from '../assets/js/utils';

export default {
  name: 'AppsConfiguration',
  data() {
    return {
      password: '',
      currentPassword: '',
      pageUnlocked: false,
      errorMessage: ''
    };
  },
  computed: {
    isPageUnlocked() {
      return !this.currentPassword || this.pageUnlocked;
    }
  },
  methods: {
    async getPassword() {
      const password = await utils.getData(PASSWORDKEY);
      this.currentPassword = password.password;
    },
    unlockPage() {
      if (bcrypt.compareSync(this.password, this.currentPassword)) {
        this.pageUnlocked = true;
        this.errorMessage = '';
      } else {
        this.errorMessage = 'Please enter a valid password';
      }
    }
  },
  mounted() {
    this.getPassword();
  }
};
</script>
