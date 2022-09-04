<template>
  <Modal :id="'card'">
    <template #body> the modal?</template>
  </Modal>
</template>


<script>
import Modal from './Modal.vue';
export default {
  setup() {
    return {};
  },
  components: { Modal }
};
</script>


<style lang="scss" scoped>
</style>
