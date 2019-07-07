<template>
  <div class="stats">
    <div>
      ACTIVE &nbsp;&nbsp;
      <span>{{ active }}</span>
    </div>
    <div>
      IDLE &nbsp;&nbsp;
      <span>{{ idle }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Statistics',
  props: ['active', 'idle']
};
</script>

<style scoped>
.stats {
  color: #fff;
  height: 47px;
  width: 214px;
  background: linear-gradient(101.75deg, #f3ae5c 0%, #d123e0 101.53%);
  border-radius: 5px;
  display: flex;
  font-size: 12px;
  justify-content: space-around;
  align-items: center;
}

.stats span {
  font-weight: bold;
  font-size: 24px;
}
</style>
