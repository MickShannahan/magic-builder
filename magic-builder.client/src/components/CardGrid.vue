<template>
  <section class="grid mt-2 pt-3">
    <div v-for="(c,i) in colCards" :key="c.id + c.scryId" class="m-card" :style="`animation-delay: ${intDelay * i}ms`">
      <CardModal :card="c" :options="options" />
    </div>
  </section>
</template>


<script>
import { ref, watchEffect } from 'vue';
import { logger } from '../utils/Logger.js';


export default {
  props: { cards: { type: Array, required: true }, options: {type: Object, default: {}} },
  setup(props) {
    const colCards = ref([])
    const intDelay = ref(10)
    watchEffect(()=>{
      logger.log('cards watch triggered')
      colCards.value = []
      colCards.value = props.cards
    })
    return {
      intDelay,
      colCards
    }
  }
};
</script>


<style lang="scss" scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(175px, 1fr));
  grid-gap: 2px;
  overflow-x: hidden;
  // overflow-y: auto;

  .m-card {
    justify-self: center;
    align-self: center;
    animation: card-drop .25s ease;
    // opacity: 0;
  }
}

@keyframes card-drop {
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
