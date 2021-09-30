<template>
  <div class="content">
    <collapsible :open="true">
      <template #title>
        <h3 class="collapsible-title">Basic</h3>
      </template>
      <form class="form">
        <div class="input-field">
          <label>Title <span class="italize">(A name or description of the app)</span></label>
          <input type="text" :value="name" />
        </div>
        <div class="input-field">
          <label>URL <span class="italize">(example: https://www.some-app-title.com)</span></label>
          <input type="text" disabled :value="config.url" />
        </div>
        <div class="input-field">
          <label>Daily Limit <span class="italize">(in minutes)</span></label>
          <input
            v-model="config.time"
            type="number"
            min="0"
            max="1440"
            @keyup.enter="update"
            @change="update" />
        </div>
        <div class="save-section box between">
          <div class="box between colorpicker">
            <div class="app-color"></div>
            Choose Color
          </div>
          <button class="btn dark save-btn">
            <save-icon class="save-icon" />Save
          </button>
        </div>
      </form>
    </collapsible>
    <collapsible :open="true" class="advanced-section">
      <template #title>
        <h3 class="collapsible-title">Advanced</h3>
      </template>
      <div>
        <p class="advanced-more">
          Advanced setting lets you choose and add
           custom time blocks to days of the week
        </p>
        <time-blocks :config-days="config.days || {}" />
        <button class="btn dark advanced-save-btn">
          <save-icon class="save-icon" />Save
        </button>
      </div>
    </collapsible>
  </div>
</template>

<script>
import utils, { CONFIGKEY, days } from '../../assets/js/utils';
import SaveIcon from '../atoms/Icons/Save';
import Collapsible from '../atoms/Collapsible';
import TimeBlocks from './TimeBlocks';

export default {
  name: 'Settings',
  components: {
    SaveIcon,
    Collapsible,
    TimeBlocks
  },
  props: {
    appKey: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      sites: {},
      name: '',
      config: {},
      daysChoosen: []
    };
  },
  async mounted() {
    this.name = this.$route.params.name;
    const allSites = await utils.getData(CONFIGKEY);
    this.sites = allSites;
    this.config = this.sites[this.name];
    days.forEach((eachDay) => {
      if (this.config.days && eachDay in this.config.days) {
        this.config.days[eachDay].forEach((timeFrame) => {
          this.daysChoosen.push({
            name: eachDay,
            from: timeFrame.from,
            to: timeFrame.to,
            active: true
          });
        });
      } else {
        this.daysChoosen.push({
          name: eachDay,
          active: false
        });
      }
    });
  },
  methods: {
    async update() {
      this.config.control = true;
      this.sites[this.name] = this.config;
      utils.saveConfiguration(CONFIGKEY, this.sites);
    },

    async addTimeFrame() {
      this.config.days = {};
      this.daysChoosen.forEach(({
        active, name, from, to
      }) => {
        if (active) {
          if (!this.config.days[name]) {
            this.config.days[name] = [];
          }
          this.config.days[name].push({
            from,
            to
          });
        }
      });
      await this.update();
      this.$router.push('/app');
    },

    keypressed(day) {
      if (this.daysChoosen[day].to > this.daysChoosen[day].from) {
        this.daysChoosen[day].active = true;
      }
    }
  },
  computed: {
    isTimeframeInvalid() {
      return this.daysChoosen.some(({ from, to }) => to < from);
    }
  }
};
</script>

<style scoped>
.advanced-header {
  margin-bottom: 8px;
}

.collapsible-title {
  font-size: 16px;
}

.input-field {
  margin-top: 24px;
}

.input-field label {
  font-size: 12px;
}

.input-field input {
  font-size: 16px;
  padding: 12px 0;
  border-radius: 0;
  border: none;
  border-bottom: 1px solid #E0E0E0;
  outline: none;
}

.input-field input:focus {
  border-bottom-color: #828282;
}

.italize {
  font-style: italic;
}

.save-section {
  margin-top: 24px;
}

.save-section .save-btn {
  padding: 7px 20px;
}

.colorpicker {
  font-size: 12px;
}

.colorpicker .app-color {
  width: 20px;
  height: 20px;
  background-color: #E3AA39;
  border-radius: 4px;
  margin-right: 12px;
  cursor: pointer;
}

.advanced-section {
  margin-top: 32px;
}

.advanced-more {
  margin-top: 12px;
  font-size: 12px;
  color: #828282;
}

.advanced-save-btn {
  width: 100%;
  margin-top: 32px;
  justify-content: center;
}
</style>
