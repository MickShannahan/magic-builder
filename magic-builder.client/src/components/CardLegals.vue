<template>
  <div class="component">
    {{ formats }}
  </div>
</template>


<script>
export default {
  props: { formats: { type: Array, required: true } },
  setup() {
    return {}
  }
};
</script>


<style lang="scss" scoped>
</style>
