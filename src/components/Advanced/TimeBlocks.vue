<template>
  <div>
    <div class="days-list">
      <div v-for="day in days" :key="day">
        <label class="checkbox">{{ day }}
          <input v-model="daysChoosen" :value="day" :id="day" type="checkbox" />
          <span class="checkmark"></span>
        </label>
      </div>
    </div>

    <div>
      <div
        v-for="chosenDay in orderedChosenDays"
        :key="chosenDay"
        class="each-day-block"
      >
        <collapsible>
          <template #title>
            <p class="day-title">{{chosenDay}}</p>
          </template>
          <div class="time-slots">
            <div
              v-for="(eachTimeBlock, index) in timeBlocks[chosenDay]"
              :key="index"
              class="time-row box between"
            >
              <div class="input-field">
                <label>Time from</label>
                <input v-model="eachTimeBlock.from" type="time" />
              </div>
              <div class="input-field">
                <label>Time to</label>
                <input v-model="eachTimeBlock.to" type="time"  />
              </div>
              <button class="btn delete-block" @click="deleteBlock(chosenDay, index)">
                <close-icon />
              </button>
            </div>
            <div class="add-time-block">
              <button class="btn" @click="addTimeBlock(chosenDay)">
                <add-icon />Add
              </button>
            </div>
          </div>
        </collapsible>
      </div>
    </div>

    <button class="btn dark advanced-save-btn" @click="saveTimeBlocks">
      <save-icon class="save-icon" />{{ buttonCaption }}
    </button>
  </div>
</template>

<script>
import Collapsible from '../atoms/Collapsible';
import AddIcon from '../atoms/Icons/Add';
import CloseIcon from '../atoms/Icons/Close';
import SaveIcon from '../atoms/Icons/Save';

export default {
  name: 'TimeBlocks',
  components: {
    Collapsible,
    AddIcon,
    CloseIcon,
    SaveIcon
  },
  props: {
    configDays: {
      type: Object,
      default: () => {}
    },
    isSaving: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      daysChoosen: [],
      timeBlocks: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: []
      }
    };
  },
  computed: {
    buttonCaption() {
      return this.isSaving ? 'Saving...' : 'Save';
    },
    days() {
      return [
        'monday', 'tuesday', 'wednesday', 'thursday',
        'friday', 'saturday', 'sunday'
      ];
    },
    orderedChosenDays() {
      return this.days.filter(each => this.daysChoosen.includes(each));
    }
  },
  methods: {
    populateTimeBlocks() {
      this.daysChoosen = Object.keys(this.configDays);
      this.days.forEach((day) => {
        this.$set(this.timeBlocks, day, [
          ...this.configDays[day] || [],
          { from: '', to: '' }
        ]);
      });
    },
    addTimeBlock(day) {
      this.timeBlocks[day].push({ from: '', to: '' });
    },
    deleteBlock(day, index) {
      this.timeBlocks[day].splice(index, 1);
    },
    saveTimeBlocks() {
      const preparedTimeBlocks = {};
      this.daysChoosen.forEach((eachDay) => {
        const timeFrames = this.timeBlocks[eachDay];
        const validTimeFrames = timeFrames.filter(eachTimeFrame => eachTimeFrame.to
          && eachTimeFrame.from
          && eachTimeFrame.to > eachTimeFrame.from);
        if (validTimeFrames.length) {
          preparedTimeBlocks[eachDay] = validTimeFrames;
        }
      });
      this.$emit('update-days-blocks', preparedTimeBlocks);
    }
  },
  mounted() {
    this.populateTimeBlocks();
  }
};
</script>

<style>
.days-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: 16px 0px 32px;
}

.days-list > div {
  width: 33%;
  margin-top: 16px;
}

.days-list label {
  text-transform: capitalize;
}

.each-day-block {
  border: 1px solid #E0E0E0;
  margin-top: 16px;
  border-radius: 4px;
}

body.dark-mode .each-day-block {
  border-color: #828282;
}

.day-title {
  font-size: 14px;
  padding: 12px 16px;
  margin: 0;
  text-transform: capitalize;
}

.each-day-block .time-slots {
  border-top: 1px solid #E0E0E0;
  padding: 18px 16px;
}

body.dark-mode .time-slots {
  border-color: #828282;
}

.time-row {
  margin-top: 16px;
}

.time-row > .input-field {
  width: 40%;
  margin-top: 0;
}

.time-row > .input-field input {
  border: none;
  font-size: 16px;
  padding: 0;
}

.time-row label {
  font-size: 12px;
  margin-bottom: 8px;
  display: block;
}

.add-time-block {
  display: flex;
  margin-top: 48px;
  justify-content: flex-end;
}

.add-time-block .btn svg path {
  fill: #828282;
}

.delete-block {
  border: 0;
  padding: 0;
  margin: 0;
}

.advanced-save-btn {
  width: 100%;
  margin-top: 32px;
  justify-content: center;
}

body.dark-mode input[type="time"]::-webkit-calendar-picker-indicator {
  filter: invert(100%);
}
</style>
