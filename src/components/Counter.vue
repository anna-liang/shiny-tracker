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
  <img :src="activeHunt.sprite" class="max-w-40 mt-8" />
  <!-- TODO: change to editable text -->
  <h1 class="my-4 text-[40px]">{{ activeHunt.count }}</h1>
  <div class="grid grid-cols-1 justify-items-center md:w-full w-4/5">
    <div class="grid grid-cols-2 gap-2 justify-items-center mb-2 w-full">
      <v-btn
        variant="flat"
        @click="handleDecrement"
        color="red"
        height="40"
        class="pb-1 w-full"
        :style="{ fontSize: '28px' }"
      >
        -
      </v-btn>
      <v-btn
        variant="flat"
        @click="handleIncrement"
        color="green"
        class="w-full"
        height="40"
        :style="{ fontSize: '28px' }"
      >
        +
      </v-btn>
    </div>
    <v-btn variant="outlined" color="red" @click="handleReset" width="500" height="40">RESET</v-btn>
  </div>
</template>
