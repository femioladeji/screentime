<template>
  <div class="content">
    <div class="settings">
      <form class="form" @submit.prevent="savePassword">
        <div v-if="isCurrentPassword" class="input-field">
          <label>Current Password</label>
          <input v-model="oldPassword" type="password" />
        </div>
         <div class="input-field">
          <label>New Password</label>
          <input v-model="newPassword" type="password" />
        </div>
        <div v-if="errorMessage" class="text-center text-error">{{ errorMessage }}</div>
        <div>
          <button type="submit" class="btn dark save">
            <save-icon class="save-icon" />{{ buttonCaption }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import bcrypt from 'bcryptjs';
import utils, { PASSWORDKEY } from '../assets/js/utils';
import SaveIcon from './atoms/Icons/Save';

export default {
  name: 'Settings',
  components: {
    SaveIcon
  },
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
