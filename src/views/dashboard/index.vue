<template>
  <div class="dashboard-container">
    <Cart/>
  </div>
</template>

<script>
import Cart from './Card/index.vue'
export default {
  name: 'Dashboard',
  components: { Cart }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
