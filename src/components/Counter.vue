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
  <img :src="activeHunt.sprite" class="max-w-40 mt-4" />
  <h1 class="my-4 text-[40px]">{{ activeHunt.count }}</h1>
  <div class="grid grid-cols-1 justify-items-center w-110 border-2 border-amber-600">
    <div class="grid grid-cols-2 gap-2 justify-items-center mb-2">
      <v-btn
        variant="flat"
        @click="handleDecrement"
        color="red"
        width="auto"
        :style="{ fontSize: '28px' }"
      >
        -
      </v-btn>
      <v-btn variant="flat" @click="handleIncrement" color="green" :style="{ fontSize: '28px' }">
        +
      </v-btn>
    </div>
    <v-btn variant="outlined" color="red" @click="handleReset">RESET</v-btn>
  </div>
</template>
