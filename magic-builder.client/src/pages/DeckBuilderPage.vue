<template>
  <div class="build-grid">
    <!--MAIN AREA-->
    <div class="grid-item container-fluid">
      <div class="row">
        <div class="col-12">
          <button class="btn btn-outline-dark" @click="display = 'collection'">Collection</button>
          <button class="btn btn-outline-dark" @click="display = 'deck'">In Deck</button>
        </div>
        <div v-if="display == 'collection'" class="col-12">
          <CardGrid :cards="cards" :options="{trackUsed: true}" />
        </div>
        <div v-else-if="display == 'deck'" class="col-12">
          <CardGrid :cards="deckCards.map(dc => new Card(dc.card))" :options="{trackUsed: true}" />
        </div>
      </div>
    </div>
    <!-- SIDE BAR -->
    <div class="side-bar elevation-2" @dragover.prevent @drop="dropToDeck">
      <div class="side-content sticky-top">
        <div class="d-flex flex-column mt-2">
          <div class="col-12 d-flex justify-content-center text-center">
            <h5 class="d-flex">{{deck.name}}</h5>
          </div>
          <div class="col-12 text-center">
            {{cardCount}}
          </div>
        </div>
        <div class="d-flex flex-column p-2">
          <transition-group name="slideX">
            <DeckCard v-for="dc in deckCards" :key="dc.id" :deckCard="dc" />
          </transition-group>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { computed, ref } from '@vue/reactivity';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { AppState } from '../AppState.js';
import CardGrid from '../components/CardGrid.vue';
import DeckCard from '../components/DeckCard.vue';
import { Card } from '../models/Card.js';
import { cardsService } from '../services/CardsService.js';
import { decksService } from '../services/DecksService.js';
import { logger } from '../utils/Logger.js';
import Pop from '../utils/Pop.js';

export default {
    setup() {
        const route = useRoute();
        const display = ref('collection')
        onMounted(async () => {
            try {
                await decksService.getDeckById(route.params.id);
            }
            catch (error) {
                Pop.error(error);
            }
        });
        return {
          Card,
          display,
            deck: computed(() => AppState.activeDeck),
            cards: computed(() => AppState.cards),
            deckCards: computed(() => AppState.activeDeck?.cards),
            cardCount: computed(()=> AppState.activeDeck.cards?.reduce((sum, cur)=> {
              logger.log(sum, cur)
              return  sum + cur.count
            }, 0)),
            account: computed(() => AppState.account),
            async dropToDeck(ev){
              try {
                let card = JSON.parse(ev.dataTransfer.getData('drag-card'))
                logger.log('drop add', card)
                await cardsService.addToDeck({cardId: card.id, deckId: route.params.id})
              } catch (error) {
                Pop.error(error)
              }
            }
        };
    },
    components: { CardGrid, DeckCard }
};
</script>


<style lang="scss" scoped>
.build-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  grid-template-rows: 100%;
  flex-grow: 1;

  .grid-item {
    align-self: stretch;
    justify-self: stretch;

  }
}

.container-fluid {
  min-height: 100%;
}

.side-bar {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-color: white;

  .side-content {}
}

h5 {
  border-bottom: 1px solid var(--bs-primary);
}

// TRANSITIONS
.slideX-enter-active {
  transition: all 0.15s cubic-bezier(.43, -1.05, .68, 1.78);
}

.slideX-leave-active {
  transform: translateX(0);
  opacity: 1;
  transition: all 0.15s linear;
}

.slideX-enter-from,
.slideX-leave-to {
  opacity: 0;
  transform: translateX(-50px);
}
</style>
