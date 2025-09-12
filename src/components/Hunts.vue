<script setup lang="ts">
import { Method, type Hunt } from '@/types'
import { v4 as uuidv4 } from 'uuid'
import { ref, onMounted, inject } from 'vue'

interface StepContext {
  step: number
  handleUpdateStep: (step: number) => void
}

const defaultStepContext: StepContext = {
  step: 1,
  handleUpdateStep: () => {},
}

const hunts = ref<Hunt[]>([])
const { step, handleUpdateStep } = inject<StepContext>('step') || defaultStepContext
const stepRef = ref(step)

onMounted(() => {
  const storedHunts = localStorage.getItem('hunts')
  hunts.value = storedHunts === null ? [] : JSON.parse(storedHunts)
})

const handleNewHunt = () => {
  const newHunt = {
    id: uuidv4(),
    pokemon: '',
    count: 0,
    method: Method.RE,
    phase: 0,
    shinyCharm: false,
    active: false,
  }
  hunts.value.unshift(newHunt)
  try {
    localStorage.setItem('hunts', JSON.stringify(hunts.value))
  } catch (error) {
    console.error('Error setting hunts', error)
  }
}

const handleUpdateHunt = () => {
  // find id of modified hunt
  // update fields in hunts
  // localStorage.setItem('hunts', JSON.stringify(hunts.value))
}
</script>

<template>
  <!-- TODO: change to editable text -->
  <button @click="handleNewHunt" type="button" class="btn btn-outline-primary">NEW HUNT</button>
  <form @submit.prevent="handleUpdateStep(parseInt(stepRef))">
    <label for="type">Step</label>
    <input
      type="text"
      class="form-control"
      v-model="stepRef"
      id="stepRef"
      name="stepRef"
      required
    />
  </form>
  <div>
    <form v-for="hunt in hunts" :key="hunt.id" @submit.prevent="handleUpdateHunt">
      <p>{{ hunt.count }}</p>
      <label for="type">Pokemon</label>
      <input type="text" class="form-control" v-model="hunt.pokemon" id="pokemon" name="pokemon" />
      <label for="type">Generation</label>
      <select class="form-select" v-model="hunt.generation" id="generation" name="generation">
        <option selected>--</option>
        <option v-for="gen in 9" :key="gen">{{ gen }}</option>
      </select>
      <label for="type">Method</label>
      <select class="form-select" v-model="hunt.method" id="method" name="method">
        <option selected>--</option>
        <option v-for="method in Method" :key="method">{{ method }}</option>
      </select>
      <label for="type">Phase</label>
      <input
        type="text"
        class="form-control"
        v-model="hunt.phase"
        id="phase"
        name="phase"
        required
      />
      <div class="form-check">
        <input class="form-check-input" type="checkbox" v-model="hunt.shinyCharm" id="shinyCharm" />
        <label class="form-check-label" for="checkDefault">Shiny Charm</label>
      </div>
      <button type="button" class="btn btn-outline-danger">
        <i class="bi bi-trash"></i>Delete
      </button>
      <button type="button" :class="['btn', hunt.active ? 'btn-success' : 'btn-outline-success']">
        Active
      </button>
    </form>
  </div>
</template>
