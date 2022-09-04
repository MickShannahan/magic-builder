<template>
  <div class="container-fluid">
    <section class="row ">
      <div class="col-12">
        <MTGSearch />
        <CardGrid :cards="cards" />
      </div>
    </section>


  </div>
</template>

<script>
import { computed } from '@vue/reactivity';
import { AppState } from '../AppState.js';
import Card from '../components/Card.vue';
import CardGrid from '../components/CardGrid.vue';
import CardModal from '../components/CardModal.vue';
import MTGSearch from '../components/MTGSearch.vue';
export default {
  name: "Home",
  setup() {
    return {
      cards: computed(() => AppState.cards)
    }
  },
  components: { MTGSearch, Card, CardModal, CardGrid }
}
</script>

<style scoped lang="scss">
</style>
