<template>
  <div class="container-fluid">
    <!-- PROFILE -->
    <section class="row">
      <img class="rounded" :src="account.picture" alt="" />
      <h2>{{ account.name }}</h2>
    </section>
    <!-- DECKS -->
    <section v-if="isOwner" class="mb-2">
      <CreateADeck />
    </section>
    <section class="row no-wrap ps-5 mb-2">
      <div v-for="d in decks" :key="d.id" class="col-3">
        <Deck :deck="d" />
      </div>
    </section>
    <!-- CARDS -->
    <section class="row">
      <div class="col-12">
        <CardGrid :cards="cards" />
      </div>
    </section>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { AppState } from '../AppState';
import CardGrid from '../components/CardGrid.vue';
import CreateADeck from '../components/CreateADeck.vue';
import Deck from '../components/Deck.vue';
import { cardsService } from '../services/CardsService.js';
import { decksService } from '../services/DecksService.js';
import { profilesService } from '../services/ProfileService.js';
import Pop from '../utils/Pop.js';
export default {
  setup() {
    const route = useRoute();
    onMounted(async () => {
      try {
        await profilesService.getProfile(route.params.id);
        await cardsService.getCards("?creatorId=" + route.params.id);
        await decksService.getDecks("?creatorId=" + route.params.id)
      }
      catch (error) {
        Pop.error(error);
      }
    });
    return {
      account: computed(() => AppState.account),
      cards: computed(() => AppState.cards),
      decks: computed(()=> AppState.decks),
      isOwner: computed(() => AppState.account.id == AppState.profile.id)
    };
  },
  components: { CardGrid, CreateADeck, Deck }
}
</script>

<style scoped>
img {
  max-width: 100px;
}
</style>
