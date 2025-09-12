<script setup lang="ts">
import Counter from '@/components/Counter.vue'
import Hunts from '@/components/Hunts.vue'
import { View } from '@/types'
import { ref } from 'vue'

const view = ref<View>(View.Counter)

const onClick = (newView: View) => {
  view.value = newView
}
</script>

<template>
  <ul class="nav nav-underline">
    <li class="nav-item">
      <a
        @click="onClick(View.Counter)"
        class="nav-link"
        :class="view.value === View.Counter && 'active'"
        >COUNTER</a
      >
    </li>
    <li class="nav-item">
      <a
        @click="onClick(View.Hunts)"
        class="nav-link"
        :class="view.value === View.Hunts && 'active'"
        >HUNTS</a
      >
    </li>
  </ul>

  <Counter v-if="view === View.Counter" />
  <Hunts v-if="view === View.Hunts" />
</template>
