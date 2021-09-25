<template>
  <div class="content">
    <div class="settings">
      <form class="form" @submit.prevent="savePassword">
        <div v-if="isCurrentPassword" class="box">
          Current Password
          <div>
            <input v-model="oldPassword" type="password" />
          </div>
        </div>
        <div class="box">
          New Password
          <div>
            <input v-model="newPassword" type="password" />
          </div>
        </div>
        <div v-if="errorMessage" class="text-center text-error">{{ errorMessage }}</div>
        <div>
          <button type="submit" class="btn save">{{ buttonCaption }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import bcrypt from 'bcryptjs';
import utils, { PASSWORDKEY } from '../assets/js/utils';

export default {
  name: 'Settings',
  data() {
    return {
      theme: '',
      newPassword: '',
      oldPassword: '',
      isCurrentPassword: '',
      errorMessage: '',
      buttonCaption: 'Save Password'
    };
  },
  methods: {
    async getPassword() {
      const password = await utils.getData(PASSWORDKEY);
      this.isCurrentPassword = password.password;
    },
    async savePassword() {
      if (this.newPassword) {
        if (this.isCurrentPassword
            && !bcrypt.compareSync(this.oldPassword, this.isCurrentPassword)) {
          this.errorMessage = 'Invalid old password';
        } else {
          const hashedPassword = bcrypt.hashSync(this.newPassword, 10);
          await utils.saveConfiguration(PASSWORDKEY, {
            [PASSWORDKEY]: hashedPassword
          });
          this.buttonCaption = 'Saving...';
          this.errorMessage = '';
          setTimeout(() => {
            this.resetFields(hashedPassword);
          }, 1500);
        }
      }
    },
    resetFields(hashedPassword) {
      this.newPassword = '';
      this.oldPassword = '';
      this.errorMessage = '';
      this.isCurrentPassword = hashedPassword;
      this.buttonCaption = 'Save Password';
    }
  },
  mounted() {
    this.getPassword();
  }
};
</script>
