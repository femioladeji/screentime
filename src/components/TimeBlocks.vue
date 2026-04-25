<script setup lang="ts">
import { daysOfTheWeek, type DailyTimeBlocks, type DayOfTheWeek, type TimeBlock } from '@/Lib'
import { computed, onMounted, reactive, ref, toRaw } from 'vue'
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

const saveTimeBlocks = (): void => {
  // Filter out empty blocks and remove unchecked days
  const cleanedTimeBlocks: Partial<DailyTimeBlocks> = {}

  daysChoosen.value.forEach(day => {
    const blocks = timeBlocks[day]?.filter(block => block.from && block.to) || []
    if (blocks.length > 0) {
      cleanedTimeBlocks[day] = blocks
    }
  })

  emits('updateDaysBlocks', cleanedTimeBlocks as DailyTimeBlocks)
}

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
const addTimeBlock = (day: DayOfTheWeek): void => {
  if (!timeBlocks[day]) {
    timeBlocks[day] = []
  }
  timeBlocks[day].push({ ...emptyBlock })
}

const validateTimeBlock = (block: TimeBlock): string | null => {
  if (!block.from || !block.to) return null
  if (block.from >= block.to) {
    return 'End time must be after start time'
  }
  return null
}

const hasValidationError = (day: DayOfTheWeek, index: number): boolean => {
  const block = timeBlocks[day]?.[index]
  return block ? validateTimeBlock(block) !== null : false
}

const getValidationError = (day: DayOfTheWeek, index: number): string | null => {
  const block = timeBlocks[day]?.[index]
  return block ? validateTimeBlock(block) : null
}

// Watch for day selection changes and auto-add first time block
const handleDayToggle = (day: DayOfTheWeek, isChecked: boolean) => {
  if (isChecked) {
    if (!timeBlocks[day]?.length) {
      addTimeBlock(day)
    }
  } else {
    // Clear time blocks when day is unchecked
    if (timeBlocks[day]) {
      timeBlocks[day] = []
    }
  }
}

onMounted((): void => {
  if (props.configDays) {
    const days = Object.keys(props.configDays) as Array<DayOfTheWeek>
    days.forEach((day) => {
      daysChoosen.value.push(day);
      timeBlocks[day] = [];
      const values = Object.values(toRaw(props.configDays![day]));
      values.forEach((timeBlock) => {
        timeBlocks[day].push({
          from: timeBlock.from,
          to: timeBlock.to
        });
      });
    });
  }
})
</script>

<template>
  <div>
    <div class="days-list">
      <div v-for="day in days" :key="day">
        <label class="checkbox">{{ day }}
          <input v-model="daysChoosen" :value="day" :id="day" type="checkbox"
            @change="(e) => handleDayToggle(day, (e.target as HTMLInputElement).checked)" />
          <span class="checkmark"></span>
        </label>
      </div>
    </div>
    <div v-if="orderedChosenDays.length === 0" class="empty-state">
      <p>👆 Select days above to configure custom time blocks</p>
    </div>
    <div v-else>
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
                <button class="btn delete-block" @click="deleteBlock(chosenDay, index)">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                  </svg>
                </button>
              </div>
              <div v-if="getValidationError(chosenDay, index)" class="time-validation-error">
                {{ getValidationError(chosenDay, index) }}
              </div>
            </div>
            <div class="add-time-block">
              <button class="btn add-btn" @click="addTimeBlock(chosenDay)">+ Add Time Block</button>
            </div>
          </div>
        </collapsible>
      </div>
    </div>

    <button class="btn dark advanced-save-btn" @click="saveTimeBlocks" :disabled="isSaving">
      {{ buttonCaption }}
    </button>
  </div>
</template>

<style scoped>
.days-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin: 16px 0px 24px;
}

.days-list label {
  text-transform: capitalize;
  font-size: 13px;
}

.each-day-block {
  border: 1px solid #E0E0E0;
  margin-top: 12px;
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg);
  transition: border-color 0.2s;
}

.each-day-block:hover {
  border-color: #bbb;
}

body.dark-mode .each-day-block {
  border-color: #828282;
}

.day-title {
  font-size: 14px;
  font-weight: 600;
  padding: 14px 16px;
  margin: 0;
  text-transform: capitalize;
  color: var(--text-color);
  background: #f9f9f9;
}

body.dark-mode .day-title {
  background: #3a3a3a;
}

.each-day-block .time-slots {
  border-top: 1px solid #E0E0E0;
  padding: 16px;
  background: var(--bg);
}

body.dark-mode .time-slots {
  border-color: #828282;
}

.time-row {
  margin-top: 0;
  margin-bottom: 12px;
  padding: 12px;
  background: #fafafa;
  border-radius: 6px;
  border: 1px solid #f0f0f0;
}

body.dark-mode .time-row {
  background: #3a3a3a;
  border-color: #4a4a4a;
}

.time-row:last-of-type {
  margin-bottom: 0;
}

.time-row>.input-field {
  width: 42%;
  margin-top: 0;
}

.time-row>.input-field label {
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 6px;
  display: block;
  color: var(--text-color);
}

.time-row>.input-field input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #E0E0E0;
  border-radius: 6px;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  color: var(--text-color);
  background-color: var(--bg);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.time-row>.input-field input:focus {
  outline: none;
  border-color: #767DE8;
  box-shadow: 0 0 0 3px rgba(118, 125, 232, 0.1);
}

.time-row .number-input {
  width: 45%;
}

.delete-block {
  border: 0;
  padding: 8px;
  margin: 0;
  margin-top: 24px;
  background: transparent;
  color: #e74c3c;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: flex-start;
}

.delete-block:hover {
  background: rgba(231, 76, 60, 0.1);
}

.add-time-block {
  display: flex;
  margin-top: 16px;
  justify-content: flex-start;
}

.add-time-block .add-btn {
  background: transparent;
  color: #767DE8;
  border: 1px dashed #767DE8;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.add-time-block .add-btn:hover {
  background: rgba(118, 125, 232, 0.1);
  border-style: solid;
}

.advanced-save-btn {
  width: 100%;
  margin-top: 24px;
  justify-content: center;
  background-color: #767DE8;
  color: #FFFFFF;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.advanced-save-btn:hover:not(:disabled) {
  background-color: #5f66d6;
}

.advanced-save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

body.dark-mode input[type='time']::-webkit-calendar-picker-indicator {
  filter: invert(100%);
}

.time-frame-error {
  font-size: 12px;
  color: #e74c3c;
  margin-top: 8px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  background: #f9f9f9;
  border-radius: 8px;
  margin: 20px 0;
}

.empty-state p {
  margin: 0;
  color: #828282;
  font-size: 14px;
}

body.dark-mode .empty-state {
  background: #3a3a3a;
}

.time-validation-error {
  font-size: 12px;
  color: #e74c3c;
  margin-top: 6px;
  padding: 4px 8px;
  background: #fee;
  border-radius: 4px;
  display: inline-block;
}
</style>
