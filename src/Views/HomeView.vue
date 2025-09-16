<script setup lang="ts">
import Counter from '@/components/Counter.vue'
import Hunts from '@/components/Hunts.vue'
import { type Hunt, Method, View } from '@/types'
import { provide, ref, onMounted } from 'vue'
import ThemeSwitch from '@/components/ThemeSwitch.vue'

const view = ref<View>(View.Counter)
const step = ref(1)
const activeHunt = ref<Hunt>({
  id: '',
  count: 0,
  method: Method.RE,
  phase: 0,
  shinyCharm: false,
  active: false,
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

const handleUpdateStep = (newStep: number | string) => {
  step.value = newStep === '' ? 0 : parseInt(newStep.toString())
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
  <ThemeSwitch />
  <div class="grid justify-items-center">
    <v-icon icon="mdi-creation" color="#e8ba17" size="56" class="mt-4"></v-icon>
    <div class="mt-4 grid justify-items-center">
      <v-tabs color="#e8ba17">
        <v-tab
          active-color="#e8ba17"
          base-color="#8b8b8f"
          @click.prevent="handleTabSwitch(View.Counter)"
        >
          <p>COUNTER</p>
        </v-tab>
        <v-tab
          active-color="#e8ba17"
          base-color="#8b8b8f"
          @click.prevent="handleTabSwitch(View.Hunts)"
        >
          <p>HUNTS</p>
        </v-tab>
      </v-tabs>

      <Counter v-if="view === View.Counter" />
      <Hunts v-if="view === View.Hunts" />
    </div>
  </div>
</template>
