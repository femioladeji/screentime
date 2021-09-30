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
        <collapsible :open="true">
          <template #title>
            <p class="day-title">{{chosenDay}}</p>
          </template>
          <div class="time-slots">
            <div
              v-for="(eachTimeBlock, index) in timeBlocks[chosenDay]"
              :key="index"
              class="time-row box between"
            >
              <div>
                <label>Time from</label>
                <input v-model="eachTimeBlock.from" type="time" />
              </div>
              <div>
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
  </div>
</template>

<script>
import Collapsible from '../atoms/Collapsible';
import AddIcon from '../atoms/Icons/Add';
import CloseIcon from '../atoms/Icons/Close';

export default {
  name: 'TimeBlocks',
  components: {
    Collapsible,
    AddIcon,
    CloseIcon
  },
  props: {
    configDays: {
      type: Object,
      default: () => {}
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
  // watch: {
  //   daysChoosen: {
  //     handler(newValue) {
  //       newValue.forEach(each => {
  //         this.$set('timeBlocks', each, [])
  //       })
  //     },
  //     immediate: true
  //   }
  // },
  computed: {
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

.time-row {
  margin-top: 16px;
}

.time-row > div {
  width: 40%;
}

.time-row > div input {
  /* width: 100%; */
  border: none;
  font-size: 16px;
}

.time-row > div input:focus {
  outline: none;
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

.add-time-block .btn {
  border: 1px solid #333333
}

.add-time-block .btn svg path {
  fill: #828282;
}

.delete-block {
  border: 0;
  padding: 0;
  margin: 0;
}
</style>
