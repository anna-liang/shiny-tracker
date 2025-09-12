<script setup lang="ts">
import Counter from '@/components/Counter.vue'
import Hunts from '@/components/Hunts.vue'
import { type Hunt, Method, View } from '@/types'
import { provide, ref, onMounted } from 'vue'

const view = ref<View>(View.Counter)
const step = ref(1)
const activeHunt = ref<Hunt>({
  id: '',
  count: 0,
  method: Method.RE,
  phase: 0,
  shinyCharm: false,
  active: true,
})

onMounted(() => {
  const storedStep = localStorage.getItem('step')
  step.value = storedStep === null ? 1 : parseInt(JSON.parse(storedStep))
})

const handleTabSwitch = (newView: View) => {
  view.value = newView
}

const handleIncrement = () => {
  activeHunt.value.count += step.value
  handleUpdateHunt()
}

const handleDecrement = () => {
  activeHunt.value.count = Math.max(0, activeHunt.value.count - step.value)
  handleUpdateHunt()
}

const handleReset = () => {
  // TODO: add warning
  activeHunt.value.count = 0
  handleUpdateHunt()
}

const handleUpdateStep = (newStep: number) => {
  step.value = newStep
  try {
    localStorage.setItem('step', JSON.stringify(step.value))
  } catch (error) {
    console.error('Error setting step', error)
  }
}

const handleUpdateHunt = () => {
  const storedHunts = localStorage.getItem('hunts')
  console.log(storedHunts)
  if (storedHunts !== null) {
    const parsedStoredHunts: Hunt[] = JSON.parse(storedHunts)
    const huntIndex = parsedStoredHunts?.findIndex((hunt: Hunt) => hunt.id === activeHunt.value.id)
    console.log('hunt index', huntIndex)
    if (huntIndex !== -1) {
      parsedStoredHunts[huntIndex] = activeHunt.value
      try {
        localStorage.setItem('hunts', JSON.stringify(parsedStoredHunts))
      } catch (error) {
        console.error('Error setting hunts', error)
      }
    }
  }
}

provide('activeHunt', {
  activeHunt,
  handleIncrement,
  handleDecrement,
  handleReset,
})

provide('step', {
  step,
  handleUpdateStep,
})
</script>

<template>
  <ul class="nav nav-underline">
    <li class="nav-item">
      <a
        @click.prevent="handleTabSwitch(View.Counter)"
        :class="['nav-link', { active: view === View.Counter }]"
        >COUNTER</a
      >
    </li>
    <li class="nav-item">
      <a
        @click.prevent="handleTabSwitch(View.Hunts)"
        :class="['nav-link', { active: view === View.Hunts }]"
        >HUNTS</a
      >
    </li>
  </ul>

  <Counter v-if="view === View.Counter" />
  <Hunts v-if="view === View.Hunts" />
</template>
