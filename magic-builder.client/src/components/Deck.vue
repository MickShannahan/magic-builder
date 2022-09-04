<template>
  <router-link :to="{name: 'DeckBuilder', params: {id: deck.id}}">
    <div class="row bg-dark text-light p-3 rounded elevation-2 selectable" title="edit deck">
      <div class="col-12 text-center">
        {{deck.name}}
      </div>
    </div>
  </router-link>
</template>


<script>
export default {
  props: {deck: {type: Object, required: true}},
  setup(){
  return {  }
  }
};
</script>


<style lang="scss" scoped>
</style>
