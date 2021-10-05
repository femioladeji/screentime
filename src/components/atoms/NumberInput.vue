<template>
  <div class="box between number-input">
    <input
      :value="value"
      type="number"
      min="0"
      :max="max"
      @keyup="change"
      @change="change"
    />
    <div>
      <button type="btn" tabindex="-1" @click="up">
        <up-icon />
      </button>
      <button type="btn" tabindex="-1" @click="down">
        <down-icon />
      </button>
    </div>
  </div>
</template>
<script>
import UpIcon from './Icons/Up';
import DownIcon from './Icons/Down';

export default {
  name: 'NumberInput',
  components: {
    UpIcon,
    DownIcon
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      required: true
    },
    max: {
      type: Number,
      required: true
    }
  },
  methods: {
    change(event) {
      event.target.reportValidity();
      this.$emit('change', event.target.value);
    },
    up(event) {
      event.currentTarget.parentElement.previousSibling.stepUp();
      this.$emit('change', event.currentTarget.parentElement.previousSibling.value);
    },
    down(event) {
      event.currentTarget.parentElement.previousSibling.stepDown();
      this.$emit('change', event.currentTarget.parentElement.previousSibling.value);
    }
  }
};
</script>

<style scoped>
.number-input {
  border-bottom: 1px solid #E0E0E0;
}
.number-input input {
  border-bottom: 0px;
  width: 100%;
}
.number-input input[type=number]::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.number-input button {
  background: none;
  border: none;
  cursor: pointer;
}
.number-input button:focus {
  outline: none;
}
</style>
