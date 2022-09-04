<template>
  <div>

    <button class="component btn btn-primary" data-bs-toggle="modal" data-bs-target="#deck-form">
      New Deck <i class="mdi mdi-plus"></i>
    </button>
    <Modal id="deck-form">
      <template #header>
        <div class="row">
          <div class="col-11">
            Create a Deck
          </div>
          <div class="col-1 p-1 selectable rounded text-center" data-bs-dismiss="modal"><i class="mdi mdi-close"></i>
          </div>
        </div>
      </template>
      <template #body>
        <form class="row" id="create-deck" @submit.prevent="handleSubmit">
          <div class="mb-2">
            <label for="" class="form-label">Deck Name</label>
            <input v-model="body.name" required maxlength="25" type="text" name="" id="" class="form-control"
              placeholder="" aria-describedby="helpId">
          </div>
          <div class="mb-2">
            <label for="" class="form-label">Format</label>
            <select v-model="body.format" class="form-control">
              <option value="">none</option>
              <option value="standard">Standard</option>
              <option value="modern">Modern</option>
              <option value="legacy">Legacy</option>
              <option value="commander">Commander</option>
              <option value="pauper">Pauper</option>
              <option value="paupercommander">Pauper Commander</option>
            </select>
          </div>
          <div class="row justify-content-end">
            <div class="col-4 btn" data-bs-dismiss="modal">cancel</div>
            <button class="col-4 btn btn-success">submit</button>
          </div>
        </form>
      </template>
    </Modal>
  </div>
</template>


<script>
import { ref } from 'vue';
import { decksService } from '../services/DecksService.js';
import Pop from '../utils/Pop.js';
import Modal from './Modal.vue';
export default {
  setup() {
    const body = ref({})
    return {
      body,
      async handleSubmit() {
        try {
          if (body.value.id) {
            // edit
          } else {
            await decksService.createDeck(body.value)
            body.value = {}
          }
        } catch (error) {
          Pop.error(error)
        }
      }
    };
  },
  components: { Modal }
};
</script>


<style lang="scss" scoped>
</style>
