<script setup lang="ts">
import { Method, type Hunt } from '@/types'
import { v4 as uuidv4 } from 'uuid'
import { ref, onMounted, inject } from 'vue'
import axios from 'axios'

interface StepContext {
  step: number
  handleUpdateStep: (step: number) => void
}

const defaultStepContext: StepContext = {
  step: 1,
  handleUpdateStep: () => {},
}

interface ActiveHuntContext {
  handleUpdateActiveHunt: (hunt: Hunt) => void
}

const defaultActiveHuntContext: ActiveHuntContext = {
  handleUpdateActiveHunt: () => {},
}

const hunts = ref<Hunt[]>([])
const { handleUpdateActiveHunt } =
  inject<ActiveHuntContext>('activeHunt') || defaultActiveHuntContext
const { step, handleUpdateStep } = inject<StepContext>('step') || defaultStepContext
const stepRef = ref(step)

onMounted(() => {
  const storedHunts = localStorage.getItem('hunts')
  hunts.value = storedHunts === null ? [] : JSON.parse(storedHunts)
})

const setHuntsInLocalStorage = () => {
  try {
    localStorage.setItem('hunts', JSON.stringify(hunts.value))
  } catch (error) {
    console.error('Error setting hunts', error)
  }
}

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
  setHuntsInLocalStorage()
}

const handleUpdatePokemon = async (id: string) => {
  // find modified hunt
  const huntIndex = hunts.value.findIndex((hunt: Hunt) => hunt.id === id)
  if (huntIndex !== -1) {
    const hunt = hunts.value[huntIndex]
    try {
      const pokemonResult = await axios.get(`https://pokeapi.co/api/v2/pokemon/${hunt?.pokemon}`)
      hunt.pokemonId = pokemonResult.data.id
      hunt.sprite = pokemonResult.data.sprites.other.showdown.front_shiny
      handleUpdateHunt(id)
    } catch (error) {
      console.error('Error fetching Pokemon', error)
    }
  }
}

const handleUpdateHunt = (id: string) => {
  // find modified hunt
  const huntIndex = hunts.value.findIndex((hunt: Hunt) => hunt.id === id)
  // update hunt in store
  if (huntIndex !== -1) {
    setHuntsInLocalStorage()
  }
}

const handleDeleteHunt = (id: string) => {
  // find hunt to delete
  const huntIndex = hunts.value.findIndex((hunt: Hunt) => hunt.id === id)
  if (huntIndex !== 1) {
    hunts.value.splice(huntIndex, 1)
    setHuntsInLocalStorage()
  }
}

const handleSetActiveHunt = (id: string) => {
  hunts.value.forEach((hunt: Hunt) => {
    if (hunt.id === id) {
      hunt.active = !hunt.active
      handleUpdateActiveHunt(hunt)
    } else {
      hunt.active = false
    }
  })
  handleUpdateHunt(id)
}
</script>

<template>
  <!-- TODO: change to editable text -->
  <button
    @click="handleNewHunt"
    type="button"
    class="btn btn-outline-primary"
    :style="{ marginTop: '40px', width: '200px', marginBottom: '10px' }"
  >
    NEW HUNT
  </button>
  <form @submit.prevent="handleUpdateStep(parseInt(stepRef))" :style="{ width: '200px' }">
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
  <div
    class="container"
    :style="{
      marginTop: '50px',
      marginBottom: '100px',
      width: '80vw',
      borderWidth: '1px',
      borderColor: '#ced2d1',
      borderRadius: '8px',
      borderStyle: 'solid',
      paddingTop: '30px',
      paddingBottom: '30px',
      paddingRight: '20px',
    }"
  >
    <form v-for="(hunt, index) in hunts" :key="hunt.id">
      <div class="row d-flex align-items-center">
        <div class="col d-flex justify-content-center">
          <img :src="hunt.sprite" :style="{ maxWidth: '100px', maxHeight: '100px' }" />
        </div>
        <div class="col d-flex justify-content-center">
          <h1>{{ hunt.count }}</h1>
        </div>
        <div class="col">
          <label for="type">Pokemon</label>
          <input
            type="text"
            @change="handleUpdatePokemon(hunt.id)"
            class="form-control"
            v-model="hunt.pokemon"
            name="pokemon"
            :style="{ marginBottom: '10px' }"
          />
          <label for="type">Generation</label>
          <select
            class="form-select"
            @change="handleUpdateHunt(hunt.id)"
            v-model="hunt.generation"
            name="generation"
          >
            <option selected>--</option>
            <option v-for="gen in 9" :key="gen">{{ gen }}</option>
          </select>
        </div>
        <div class="col">
          <label for="type">Method</label>
          <select
            class="form-select"
            @change="handleUpdateHunt(hunt.id)"
            v-model="hunt.method"
            name="method"
            :style="{ marginBottom: '10px' }"
          >
            <option selected>--</option>
            <option v-for="method in Method" :key="method">{{ method }}</option>
          </select>
          <label for="type">Phase</label>
          <input
            type="text"
            @change="handleUpdateHunt(hunt.id)"
            class="form-control"
            v-model="hunt.phase"
            name="phase"
            required
          />
        </div>
        <div class="col">
          <div class="form-check" :style="{ marginLeft: '5px' }">
            <input
              class="form-check-input"
              type="checkbox"
              @change="handleUpdateHunt(hunt.id)"
              v-model="hunt.shinyCharm"
              name="shinyCharm"
            />
            <label class="form-check-label" for="checkDefault">Shiny Charm</label>
          </div>
          <div class="row d-flex justify-content-evenly align-items-center">
            <button
              type="button"
              @click="handleSetActiveHunt(hunt.id)"
              :class="['btn', hunt.active ? 'btn-success' : 'btn-outline-success']"
              :style="{
                marginTop: '15px',
                marginBottom: '15px',
                width: '40%',
              }"
            >
              Active
            </button>
            <!-- TODO: add warning -->
            <button
              :style="{ width: '40%', height: '40px' }"
              type="button"
              class="btn btn-outline-danger"
              @click="handleDeleteHunt(hunt.id)"
            >
              <i class="bi bi-trash"></i>Delete
            </button>
          </div>
        </div>
      </div>
      <hr v-if="index !== hunts.length - 1" :style="{ marginTop: '35px', marginBottom: '35px' }" />
    </form>
  </div>
</template>
