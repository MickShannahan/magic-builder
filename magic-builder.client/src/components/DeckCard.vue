<template>
  <div class="dc-wrapper" @click="removeFromDeck">
    <div class="card-under bg-danger text-end"><i class="mdi mdi-delete-outline"></i></div>
    <div class="deck-card rounded mt-1" :style="`background-image: url(${bg})`">
      <div class="filter py-2 px-1">
        <div class="d-flex justify-content-between">
          <div>{{deckCard.card.name}}</div>
          <div v-if="deckCard.count > 1" class="pe-2">x{{deckCard.count}}</div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { computed } from '@vue/reactivity';
import { cardsService } from '../services/CardsService.js';
import Pop from '../utils/Pop.js';

export default {
  props: {deckCard: {type: Object}},
  setup(props){
  return {
    bg: computed(()=> `url(${props.deckCard?.card.imgArt})`),
    async removeFromDeck(){
      try {
        await cardsService.removeFromDeck(props.deckCard.id)
      } catch (error) {
        Pop.error(error)
      }
    }
   }
  }
};
</script>


<style lang="scss" scoped>
.dc-wrapper {
  position: relative;
  cursor: pointer;
  transition: .1s .05s linear all;


  &:hover {
    transform: translateX(-20px);
  }

  &:hover .filter {
    backdrop-filter: contrast(.75) brightness(1.3);
  }

  &:hover .card-under {
    transform: translateX(20px);

  }
}

.deck-card {
  outline: 2px solid rgb(255, 253, 218);
  display: flex;
  background-image: v-bind(bg);
  background-position: center;
  background-size: cover;
  color: rgb(255, 253, 218);
  text-shadow: 0px 0px 3px rgb(20, 5, 18);
  font-weight: bold;
  transition: .1s linear all;
  cursor: pointer;

  &:hover {}

  .filter {
    width: 100%;
    height: 100%;
    backdrop-filter: contrast(.7);
    transition: .1s .05s linear all;
  }
}

.card-under {
  top: 2px;
  right: 1px;
  height: 99%;
  width: 99%;
  position: absolute;
  padding: .55em 2px;
  z-index: -1;
  border-radius: 8px;
  transition: .1s .05s linear all;

}
</style>
