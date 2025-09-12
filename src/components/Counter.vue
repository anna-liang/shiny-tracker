<script setup lang="ts">
import { Method, type Hunt } from '@/types'
import { inject } from 'vue'

interface ActiveHuntContext {
  activeHunt: Hunt
  handleIncrement: () => void
  handleDecrement: () => void
  handleReset: () => void
}

const defaultActiveHuntContext: ActiveHuntContext = {
  activeHunt: {
    id: '',
    count: 0,
    method: Method.RE,
    phase: 0,
    shinyCharm: false,
    active: true,
  },
  handleIncrement: () => {},
  handleDecrement: () => {},
  handleReset: () => {},
}

const { activeHunt, handleIncrement, handleDecrement, handleReset } =
  inject<ActiveHuntContext>('activeHunt') || defaultActiveHuntContext
</script>

<template>
  <!-- TODO: change to editable text -->
  <h1>{{ activeHunt.count }}</h1>
  <div class="d-grid gap-2">
    <div class="row gap-2">
      <button @click="handleDecrement" type="button" class="btn btn-danger col">-</button>
      <button @click="handleIncrement" type="button" class="btn btn-success col">+</button>
    </div>
    <button @click="handleReset" type="button" class="btn btn-outline-danger">RESET</button>
  </div>
</template>
