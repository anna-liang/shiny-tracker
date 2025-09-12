<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0) // TODO: get from local storage
const step = ref(1) // TODO: get from local storage

const incrementHandler = () => {
  count.value += step.value
}

const decrementHandler = () => {
  count.value = Math.max(0, count.value - step.value)
}

const resetHandler = () => {
  // TODO: add warning
  count.value = 0
}
</script>

<template>
  <!-- TODO: change to editable text -->
  <h1>{{ count }}</h1>
  <div class="d-grid gap-2">
    <div class="row gap-2">
      <button @click="decrementHandler" type="button" class="btn btn-danger col">-</button>
      <button @click="incrementHandler" type="button" class="btn btn-success col">+</button>
    </div>
    <button @click="resetHandler" type="button" class="btn btn-outline-danger">RESET</button>
  </div>
</template>
