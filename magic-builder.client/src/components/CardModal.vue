<template>
  <div class="component">
    <div :id="'cc-' + card.scryId" class="card-container">
      <div v-if="card.count" class="card-count">{{card.count}}</div>
      <!-- modal -->
      <div class="card-modal">
        <!-- Initial -->
        <div class="from">
          <div class="from-contents " draggable="true" @dragstart="dragging">
            <img class="img-fluid card-img" :class="{'all-used': allUsed}" :src="card.imgMed" alt="" @click="open">
          </div>
        </div>
        <!-- Initial -->
        <!-- Expanded -->
        <div v-show="showExpand" class="to" :style="`top: ${posY}vh; left: calc( calc(50vw - 420px) + ${posX}px)`">
          <div class="to-contents" :style="`transform-origin: ${expX}px ${expY}px`">
            <div class="d-flex card-content">
              <!-- mimic initial -->
              <div class="left">
                <img class="img-fluid" :src="card.imgMed" alt="">
              </div>
              <!--  -->
              <!-- Details -->
              <div class="right px-3">
                <section class="row">
                  <h6 class="col-11 text-center ps-2 fw-bold card-title text-primary">{{ card.name }}</h6>
                  <div class="col-1 text-center selectable p-1 rounded-pill" @click.stop="close">
                    <i class="mdi mdi-close"></i>
                  </div>
                </section>
                <section class="row text-center">
                  <div class="col-4 tab" :class="{ 'tab-selected': tab == 'details' }" @click="tab = 'details'">details
                  </div>
                  <div class="col-4 tab" :class="{ 'tab-selected': tab == 'legal' }" @click="tab = 'legal'">legalities
                  </div>
                  <div class="col-4 tab" :class="{ 'tab-selected': tab == 'prints' }" @click="tab = 'prints'">prints
                  </div>
                </section>
                <!-- Tab outs -->
                <section v-if="tab == 'details'" class="row">
                  <div class="col-12">{{ card.type }}</div>
                  <div class="col-12">{{ card.text }}</div>
                  <div class="col-12">{{ card.flavor }}</div>
                </section>
                <section v-if="tab == 'legal'">
                  <CardLegals :formats="card.formats" />
                </section>
                <!--  -->
              </div>
              <!--  -->
            </div>
            <!-- end of card -->
            <!-- add card -->
            <div class="add-button d-flex justify-content-center flex-column">
              <button v-if="card.creatorId == account.id" class="btn btn-success lighten-20 deck-button"
                @click.stop="addToDeck"><i mdi mdi-arrow-right></i></button>
              <button class="btn btn-info lighten-20 deck-button" @click.stop="addToCollection"><i mdi
                  mdi-plus></i></button>
            </div>
          </div>
        </div>
        <!-- expanded -->
      </div>
    </div>


  </div>
</template>


<script>
import { computed } from '@vue/reactivity';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { AppState } from '../AppState.js';
import { Card } from '../models/Card.js';
import { cardsService } from '../services/CardsService';
import { logger } from '../utils/Logger.js';
import Pop from '../utils/Pop.js';
import CardLegals from './CardLegals.vue';

export default {
  props: { card: { type: Card, required: true }, options: {type: Object, default: {}} },
  setup(props) {
    const tab = ref("details");
    const showExpand = ref(false)
    const expand = ref(false);
    const posX = ref(0);
    const posY = ref(30);
    const expX = ref(0);
    const expY = ref(0);
    const route = useRoute()
    onMounted(()=> setTimeout(()=>showExpand.value = true, 750))
    return {
      showExpand,
      expand,
      tab,
      expX,
      expY,
      posX,
      posY,
      account: computed(()=> AppState.account),
      allUsed: computed(() => {
        if(props.options.trackUsed)
        return AppState.activeDeck.cards?.find(dc => dc.cardId == props.card.id)?.count == props.card.count
      }),
      changeTab(select) {
        tab.value = select;
      },
      async addToCollection() {
        try {
          await cardsService.addToCollection(props.card)
          Pop.toast(`added ${card.name} to collection`, '', '', 'top-center')
        } catch (error) {
          Pop.error(error)
        }
      },
      async addToDeck() {
        try {
          await cardsService.addToDeck({cardId: props.card.id, deckId: route.params.id})
          Pop.toast(`added ${card.name} to collection`, 'success', 'top')
        } catch (error) {
          Pop.error(error)
        }
      },
      dragging(ev){
        logger.log(ev)
        ev.dataTransfer.setData('drag-card', JSON.stringify(props.card))
      },
      open(ev) {
        document.querySelectorAll(".card-container").forEach(cc => cc.classList.remove("expand"));
        document.querySelector("#cc-" + props.card.scryId).classList.add("expand");
        logger.log(ev);
        expX.value = ev.screenX;
        expY.value = ev.screenY;
        expand.value = true;
      },
      close() {
        document.querySelector("#cc-" + props.card.scryId).classList.remove("expand");
        expand.value = false;
      }
    };
  },
  components: { CardLegals }
};
</script>


<style lang="scss" scoped>
@import '../assets/scss/main.scss';
$b-radius: 7px;

.card-container {
  position: relative;
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
  cursor: pointer;

  &.expand {
    overflow: visible;
    cursor: unset;

    .from {
      overflow: hidden;
    }

    .to {
      z-index: 10000 !important;
    }
  }
}

.card-content {
  box-shadow: 0px 4px 15px rgba(13, 1, 15, 0.514);
  overflow: hidden;
}

.card-count {
  position: absolute;
  bottom: .3em;
  left: .25em;
  min-width: 1.5em;
  z-index: 1;
  text-align: center;
  border-radius: 45em;
}

.card-img {
  border-radius: $b-radius;
}

.all-used {
  filter: grayscale(.7) contrast(.7);
}

.card-title {
  padding-bottom: .25em;
  border-bottom: 1px solid darken($light, 40);
}

.img-fluid {
  // border: inset 3px black;
  border-radius: $b-radius;
}

.card-modal {
  background: darken($light, 30);
  background-image: url('https://www.transparenttextures.com/patterns/45-degree-fabric-light.png');
  box-shadow: inset 0px 0px 6px rgba(12, 5, 19, 0.452);
  border-radius: $b-radius;
  position: relative;
  -webkit-tap-highlight-color: transparent;
  transition: width 300ms cubic-bezier(0.4, 0.0, 0.2, 1),
    height 300ms cubic-bezier(0.4, 0.0, 0.2, 1),
    box-shadow 300ms cubic-bezier(0.4, 0.0, 0.2, 1),
    border-radius 300ms cubic-bezier(0.4, 0.0, 0.2, 1);
}

.tab {
  cursor: pointer;

  transition: all .1s ease-in;

  &:hover {
    background-color: lighten($secondary, 20);
  }

  &.tab-selected {
    background-color: lighten($secondary, 20);
  }
}

.deck-button {
  display: flex;
  height: 50px;
  width: 50px;
  text-align: center;
  text-justify: center;
  padding: 1.5em;
  transform: translate(-40%, 0px);
  transform-origin: 35% 0%;
  border-radius: 50em;
}

.from {
  transition: opacity 200ms 100ms cubic-bezier(0.0, 0.0, 0.2, 1), transform 100ms cubic-bezier(0.0, 0.0, 0.2, 1);

  &:hover {
    transform: translateY(-5px);
    filter: drop-shadow(0px 2px 5px rgba(0, 0, 0, 0.466));
  }
}

.from-contents {
  display: flex;
  flex-direction: row;
  transform-origin: center center;
  transition: transform 300ms cubic-bezier(0.4, 0.0, 0.2, 1);
}

.to {
  opacity: 0;
  z-index: -1;
  // positions is calculated inline
  position: fixed;
  transition: opacity 100ms cubic-bezier(0.4, 0.0, 1, 1);
  border-radius: 10px;
  overflow: hidden;
}

.to-contents {
  transform: scale(.75);
  // transform-origin: center center inline calc;
  transition: transform 300ms cubic-bezier(0.4, 0.0, 0.2, 1);
  display: flex;
}

.left {
  background: var(--bs-light);
  display: flex;
  flex-direction: row;
  height: 375px;
  transition: height 300ms cubic-bezier(0.4, 0.0, 0.2, 1);
  width: 270px;
}

.right {
  background: var(--bs-light);
  color: var(--bs-dark);
  font-size: 14px;
  padding-top: 5px;
  width: 500px;
}

.expand .from {
  opacity: 0;
  transition: opacity 100ms cubic-bezier(0.4, 0.0, 1, 1);
}

.expand .from-contents {
  transform: scale(1.91);
}

.expand .to {
  opacity: 1;
  transition: opacity 200ms 100ms cubic-bezier(0.0, 0.0, 0.2, 1);
}

.expand .to-contents {
  transform: scale(1);
}
</style>
