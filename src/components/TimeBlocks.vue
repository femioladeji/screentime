<script setup lang="ts">
import { daysOfTheWeek, type DailyTimeBlocks, type DayOfTheWeek, type TimeBlock } from '@/Lib'
import { computed, onMounted, reactive, ref } from 'vue'
import Collapsible from './Collapsible.vue'

const emptyBlock: TimeBlock = {
  from: '',
  to: ''
}

const props = defineProps<{
  configDays?: DailyTimeBlocks
  isSaving: boolean
}>()

const emits = defineEmits<{
  (e: 'updateDaysBlocks', daysBlocks: DailyTimeBlocks): void
}>()

const saveTimeBlocks = (): void => emits('updateDaysBlocks', timeBlocks)

const daysChoosen = ref<Array<DayOfTheWeek>>([])
const days = Object.values(daysOfTheWeek)
const orderedChosenDays = computed(() => days.filter((day) => daysChoosen.value.includes(day)))
const buttonCaption = computed(() => (props.isSaving ? 'Saving...' : 'Save'))

const timeBlocks = reactive<
  Record<
    DayOfTheWeek,
    Array<{
      from: string
      to: string
    }>
  >
>(
  {} as Record<
    DayOfTheWeek,
    Array<{
      from: string
      to: string
    }>
  >
)

const deleteBlock = (day: DayOfTheWeek, index: number): void => void timeBlocks[day].splice(index, 1)
const addTimeBlock = (day: DayOfTheWeek): void => void timeBlocks[day].push(emptyBlock)

onMounted((): void => {
  if (props.configDays) {
    const days = Object.keys(props.configDays) as Array<DayOfTheWeek>
    days.forEach((day) => {
      daysChoosen.value.push(day)
      timeBlocks[day] = []
      props.configDays![day].forEach((timeBlock) => {
        timeBlocks[day].push({
          from: timeBlock.from,
          to: timeBlock.to
        })
      })
    })
  }
})
</script>

<template>
  <div>
    <div class="days-list">
      <div v-for="day in days" :key="day">
        <label class="checkbox"
          >{{ day }}
          <input v-model="daysChoosen" :value="day" :id="day" type="checkbox" />
          <span class="checkmark"></span>
        </label>
      </div>
    </div>
    <div>
      <div v-for="chosenDay in orderedChosenDays" :key="chosenDay" class="each-day-block">
        <collapsible>
          <template #title>
            <p class="day-title">{{ chosenDay }}</p>
          </template>
          <div class="time-slots">
            <div v-for="(eachTimeBlock, index) in timeBlocks[chosenDay]" :key="index">
              <div class="time-row box between">
                <div class="input-field">
                  <label>Time from</label>
                  <div class="box between">
                    <input type="time" v-model="eachTimeBlock.from" min="00:00" max="23:59" />
                  </div>
                </div>
                <div class="input-field">
                  <label>Time to</label>
                  <div class="box between">
                    <input type="time" v-model="eachTimeBlock.to" min="00:00" max="23:59" />
                  </div>
                </div>
                <button class="btn delete-block" @click="deleteBlock(chosenDay, index)">Delete</button>
              </div>
            </div>
            <div class="add-time-block">
              <button class="btn" @click="addTimeBlock(chosenDay)">Add</button>
            </div>
          </div>
        </collapsible>
      </div>
    </div>

    <button class="btn dark advanced-save-btn" @click="saveTimeBlocks">
      {{ buttonCaption }}
    </button>
  </div>
</template>

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
  border: 1px solid #e0e0e0;
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
  border-top: 1px solid #e0e0e0;
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
  font-size: 16px;
  /* width: 45%; */
}

.time-row .number-input {
  width: 45%;
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

body.dark-mode input[type='time']::-webkit-calendar-picker-indicator {
  filter: invert(100%);
}

.time-frame-error {
  font-size: 12px;
}
</style>
