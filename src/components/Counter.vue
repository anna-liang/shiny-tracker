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
  <img :src="activeHunt.sprite" :style="{ marginTop: '40px' }" />
  <h1 :style="{ marginTop: '20px', marginBottom: '20px' }">{{ activeHunt.count }}</h1>
  <div class="d-grid gap-2" :style="{ width: '520px' }">
    <div class="row gap-2" :style="{ marginLeft: '1px', marginRight: '1px' }">
      <button
        @click="handleDecrement"
        type="button"
        class="btn btn-danger col"
        :style="{
          fontSize: '28px',
          maxHeight: '40px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: '10px',
        }"
      >
        -
      </button>
      <button
        @click="handleIncrement"
        type="button"
        class="btn btn-success col"
        :style="{
          fontSize: '28px',
          maxHeight: '40px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: '10px',
        }"
      >
        +
      </button>
    </div>
    <button @click="handleReset" type="button" class="btn btn-outline-danger">RESET</button>
  </div>
</template>
