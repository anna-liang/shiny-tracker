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
  const storedHunts = localStorage.getItem('hunts')
  if (storedHunts !== null) {
    const hunts = JSON.parse(storedHunts)
    const filterActive = hunts.filter((hunt: Hunt) => hunt.active === true)
    if (filterActive.length > 0) activeHunt.value = filterActive[0]
  }
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
  if (storedHunts !== null) {
    const parsedStoredHunts: Hunt[] = JSON.parse(storedHunts)
    const huntIndex = parsedStoredHunts?.findIndex((hunt: Hunt) => hunt.id === activeHunt.value.id)
    if (huntIndex !== -1) {
      parsedStoredHunts[huntIndex] = activeHunt.value
      try {
        localStorage.setItem('hunts', JSON.stringify(parsedStoredHunts))
      } catch (error) {
        console.error('Error updating hunts', error)
      }
    }
  }
}

const handleUpdateActiveHunt = (hunt: Hunt) => {
  activeHunt.value = hunt
}

provide('activeHunt', {
  activeHunt,
  handleIncrement,
  handleDecrement,
  handleReset,
  handleUpdateActiveHunt,
})

provide('step', {
  step,
  handleUpdateStep,
})
</script>

<template>
  <div class="col d-flex flex-column align-items-center" :style="{ marginTop: '20px' }">
    <i class="bi bi-stars" :style="{ color: '#e8ba17', fontSize: '50px' }"></i>
    <div class="container" :style="{ marginTop: '20px' }">
      <div class="col d-flex flex-column align-items-center">
        <ul class="nav nav-underline">
          <li class="nav-item">
            <a
              @click.prevent="handleTabSwitch(View.Counter)"
              :class="['nav-link', { active: view === View.Counter }]"
              :style="{ color: view === View.Counter ? '#e8ba17' : '#535152' }"
              >COUNTER</a
            >
          </li>
          <li class="nav-item">
            <a
              @click.prevent="handleTabSwitch(View.Hunts)"
              :class="['nav-link', { active: view === View.Hunts }]"
              :style="{ color: view === View.Hunts ? '#e8ba17' : '#535152' }"
              >HUNTS</a
            >
          </li>
        </ul>

        <Counter v-if="view === View.Counter" />
        <Hunts v-if="view === View.Hunts" />
      </div>
    </div>
  </div>
</template>
