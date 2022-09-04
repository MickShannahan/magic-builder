<template>
  <section class="m-card" @click="openDetails">
    <img class="img-fluid" :src="card.imgNoB || card.imgMed" alt="">
  </section>
</template>


<script>
import { Modal } from 'bootstrap';
import { Card } from '../models/Card.js';

export default {
  props: { card: { type: Card, required: true } },
  setup() {
    return {
      openDetails() {
        Modal.getOrCreateInstance(document.getElementById('card')).show()
      }
    }
  }
};
</script>


<style lang="scss" scoped>
.m-card {
  width: 100%;
  margin-bottom: 5px;
  border: 2px solid black;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0px 5px 8px rgba(0, 0, 0, 0.678);
    transition: all .2s ease;
  }
}
</style>
