<template>
  <!-- if you want to close by clicking outside the modal, delete the last endpoint:data-bs-backdrop and data-bs-keyboard -->
  <div class="modal fade" tabindex="-1" data-bs-keyboard="false" role="dialog" aria-labelledby="modalTitleId"
    aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content p-3">
        <slot name="header">
          <!-- Header -->
          <!-- <div class="modal-header"></div> -->
        </slot>
        <div class="modal-body">
          <slot name="body">
            <!-- Body -->
          </slot>
        </div>
        <slot name="footer">
          <!-- Footer slot -->
          <!-- <div class="modal-footer">
          </div> -->
          <!--  -->
        </slot>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  setup() {
    return {}
  }
};
</script>


<style lang="scss" scoped>
</style>
