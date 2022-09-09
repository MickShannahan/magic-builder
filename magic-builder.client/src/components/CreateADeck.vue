<template>
  <div>

    <button class="component btn btn-primary" data-bs-toggle="modal" data-bs-target="#deck-form">
      New Deck <i class="mdi mdi-plus"></i>
    </button>
    <Modal id="deck-form">
      <template #header>
        <div class="row bg-primary rounded-top p-3">
          <div class="col-11">
            Create a Deck
          </div>
          <div class="col-1 p-1 selectable rounded text-center" data-bs-dismiss="modal"><i class="mdi mdi-close"></i>
          </div>
        </div>
      </template>
      <template #body>
        <div class="row p-3 rounded-bottom" id="create-deck"
          :style="`background-image: ${gradient}, url(${selectedArt});`">
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
          <label for="" class="form-label">Deck Cover</label>
          <div class="mb-2 input-group">
            <input @keyup="searchCardArt" v-model="artSearch" maxlength="30" type="text" name="" id=""
              class="form-control" placeholder="search card art" aria-describedby="helpId">
            <button class="btn btn-secondary" :class="{'btn-success': selectedArt}" type="button"
              @click="searchCardArt"><i class="mdi mdi-magnify"></i></button>
          </div>
          <!-- STUB card arts -->
          <section class="art-grid">
            <!-- art -->
            <img v-for="a in cardArts" :key="a" :src="a" class="m-art" @click="selectedArt = a" />
          </section>
          <div class="row justify-content-end">
            <div class="col-4 btn" data-bs-dismiss="modal">cancel</div>
            <button class="col-4 btn btn-success" @click="handleSubmit">submit</button>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>


<script>
import { computed } from '@vue/reactivity';
import { Modal } from 'bootstrap';
import { ref } from 'vue';
import { AppState } from '../AppState.js';
import { router } from '../router.js';
import { cardsService } from '../services/CardsService.js';
import { decksService } from '../services/DecksService.js';
import Pop from '../utils/Pop.js';
export default {
  setup() {
    const body = ref({})
    const artSearch = ref('')
    const selectedArt = ref('')
    return {
      body,
      artSearch,
      selectedArt,
      cardArts: computed(()=> AppState.cardArts.slice(0, 17)),
      gradient: 'linear-gradient(0deg, rgba(250,248,244,.9) 64%, rgba(250,248,244,0.3) 100%)',
      async handleSubmit() {
        try {
          if (body.value.id) {
            // edit
          } else {
            body.value.img = selectedArt.value
            let deckId = await decksService.createDeck(body.value)
            body.value = {}
            selectedArt.value = ''
            Modal.getOrCreateInstance(document.getElementById('deck-form')).hide()
            router.push({name: 'DeckBuilder', params:{id: deckId}})
          }
        } catch (error) {
          Pop.error(error)
        }
      },
      async searchCardArt(){
        try {
          if(artSearch.value.length >= 3)
          await cardsService.searchScryArt(artSearch.value)
        } catch (error) {

        }
      }
    };
  }
};
</script>


<style lang="scss" scoped>
.art-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  overflow-x: hidden;
  // overflow-y: auto;

  .m-art {
    height: 60px;
    width: 100%;
    object-fit: cover;
    justify-self: center;
    align-self: center;
    animation: art-drop .1s ease;
    transition: filter .1s linear;
    cursor: pointer;

    // opacity: 0;
    &:hover {
      filter: brightness(1.5);
    }
  }
}

#create-deck {
  background-position: center;
  background-size: cover;
}

@keyframes art-drop {
  0% {
    opacity: 0;
    transform: translate(50px, -15px) rotate3d(0, 1, 0, 90deg);
  }

  100% {
    opacity: 1;
    transform: translate(0px, 0px) rotate3d(0);
  }
}
</style>
