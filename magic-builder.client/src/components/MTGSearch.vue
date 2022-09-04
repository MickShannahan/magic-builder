<template>
  <div class="row bg-info search">
    <div id="collapse-1" class="col-3 p-2 ">
      <form class="input-group text-dark" @submit.prevent="search">
        <input v-model="term" id="card-search" type="text" class="form-control" placeholder="Search for cards"
          aria-label="search cards" aria-describedby="button-addon2">
        <button class="btn btn-secondary px-3" title="search"><i class="mdi mdi-magnify"></i></button>
      </form>
    </div>
    <!-- searchable -->
    <div class="col-2" v-for="(opt, key) in searchables">
      <b>{{ key }}</b>
      <div class="row">
        <!-- STUB check boxes -->
        <div class="form-check col-6" v-for="(o, i) in opt.values">
          <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"
            @change="updateOptionChecks(opt.search, o)">
          <label class="form-check-label" for="flexCheckDefault">
            {{ opt.text[i] }}
          </label>
        </div>
      </div>
    </div>

  </div>
</template>


<script>
import { Collapse } from 'bootstrap';
import { ref } from 'vue';
import { cardsService } from '../services/CardsService';

export default {
  setup() {
    const term = ref('')
    const options = ref({})
    return {
      term,
      options,
      async search() {
        await cardsService.searchScry(term.value, options.value)
      },
      updateOptionChecks(term, value) {
        let opts = options.value
        if (!opts[term]) opts[term] = []
        if (opts[term].includes(value)) {
          opts[term] = opts[term].filter(t => t != value)
          if (opts[term].length == 0) delete opts[term]
        } else {
          opts[term].push(value)
        }
      },
      updateOptionStyle(term, value) {

      },
      open(id) {
        const collapse = Collapse.getOrCreateInstance(document.getElementById(id))
        collapse.show()
      },
      close(id) {
        const collapse = Collapse.getOrCreateInstance(document.getElementById(id))
        collapse.hide()
      },
      searchables: {
        Color: {
          search: 'color',
          text: ['Red', 'Blue', 'Black', 'White', 'Green', 'Colorless'],
          values: ['r', 'u', 'b', 'w', 'g', 'c']
        },
        Rarity: {
          search: 'rarity',
          text: ['common', 'uncommon', 'rare', 'mythic'],
          values: ['c', 'u', 'r', 'm']
        },
        Format: {
          search: 'legal',
          text: ['standard', 'legacy', 'modern', 'commander', 'pauper', 'pauper commander'],
          values: ['standard', 'legacy', 'modern', 'commander', 'pauper', 'paupercommander']
        }
      }
    }
  }
};
</script>


<style lang="scss" scoped>
.search {
  min-height: 2vh;
}
</style>
