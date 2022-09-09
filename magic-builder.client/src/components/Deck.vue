<template>
  <router-link :to="{name: 'DeckBuilder', params: {id: deck.id}}">
    <div class="deck-wrapper p-3">
      <!-- color ribbons -->
      <div class="color-count">
        <div class="ribbon" :class="'bg-'+clr" v-for="(num, clr) in calcColors">{{num}}</div>
      </div>
      <!-- ribbons end -->
      <div class="deck row bg-dark text-light p-3 rounded elevation-2 selectable"
        :style="`background-image: url(${deck.img})`" title="edit deck">
        <div class="col-12 text-center deck-name d-flex align-items-center justify-content-center">
          {{deck.name}}
        </div>
      </div>
    </div>
  </router-link>
</template>


<script>
import { computed } from '@vue/reactivity';
import { logger } from '../utils/Logger.js';

export default {
  props: {deck: {type: Object, required: true}},
  setup(props){
  return {
    calcColors: computed(()=>{
      let dict = {}
      props.deck.cards?.forEach(c =>{
        let card = c.card
        logger.log(card)
        if(!card.colors.length){
          if(dict.CL){
            dict.CL++
          } else {
            dict.CL = 1
          }
        }else if(dict[card.colors[0]]){
          dict[card.colors[0]]++
        } else {
          dict[card.colors[0]] = 1
        }
      })
      return dict
    })
   }
  }
};
</script>


<style lang="scss" scoped>
@import '../assets/scss/main.scss';

.deck-wrapper {
  position: relative;
}

.color-count {
  top: 7px;
  position: absolute;
  display: flex;
  text-align: center;
  min-width: 2em;
  height: 3em;
  z-index: 1;
  filter: drop-shadow(0px 2px 3px rgba(17, 2, 20, 0.603));
}

.ribbon {
  height: 100%;
  padding-top: .7em;
  min-width: 1.5em;
  margin-right: .2em;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  clip-path: polygon(100% 0, 100% 100%, 50% 82%, 0 100%, 0% 0%);
  font-weight: 700;
  color: $light;
  text-shadow: 0px 0px 3px rgba(0, 0, 0, 0.6), 0px 1px 0px rgba(0, 0, 0, 0.6), 1px 0px 0px rgba(0, 0, 0, 0.6), -1px 0px 0px rgba(0, 0, 0, 0.6), 0px -1px 0px rgba(0, 0, 0, 0.6);
}

.deck {
  background-position: center;
  background-size: cover;
  height: 180px;

  &-name {
    text-shadow: 0px 1px 3px black;
    font-weight: bold;
  }
}

.bg-R {
  background-color: $m-red;
}

.bg-U {
  background-color: $m-blue;
}

.bg-G {
  background-color: $m-green;
}

.bg-B {
  background-color: $m-black;
}

.bg-W {
  background-color: $m-white;
}

.bg-CL {
  background-color: $m-colorless;
}
</style>
