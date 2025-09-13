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
const allPokemonNames = ref<string[]>([])
const { handleUpdateActiveHunt } =
  inject<ActiveHuntContext>('activeHunt') || defaultActiveHuntContext
const { step, handleUpdateStep } = inject<StepContext>('step') || defaultStepContext
const stepRef = ref(step)

onMounted(async () => {
  const storedHunts = localStorage.getItem('hunts')
  console.log('mounted', JSON.parse(storedHunts))
  hunts.value = storedHunts === null ? [] : JSON.parse(storedHunts)

  // fetch names of all pokemon for dropdown search ease
  try {
    const { data } = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=2000')
    // replace - with whitespace for better readability
    const allPokemon = data.results.map((pokemon: { name: string; url: string }) => {
      return pokemon.name.replace(/[- ]/g, ' ')
    })
    allPokemonNames.value = allPokemon
  } catch (error) {
    console.log('Error fetching Pokemon', error)
  }
})

const setHuntsInLocalStorage = () => {
  console.log('set local store', hunts.value)
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
  console.log(huntIndex)
  if (huntIndex !== -1) {
    const hunt = hunts.value[huntIndex]
    console.log(hunt?.pokemon?.replace(/[' ']/g, '-'))
    try {
      // replace whitespace with -
      const pokemonResult = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${hunt?.pokemon?.replace(/[' ']/g, '-')}`,
      )
      hunt.pokemonId = pokemonResult.data.id
      hunt.sprite = pokemonResult.data.sprites.other.showdown.front_shiny
      handleUpdateHunt(id)
    } catch (error) {
      console.error('Error fetching Pokemon', error)
    }
  }
}

const handleUpdateHunt = (id: string) => {
  console.log('update hunt')
  // find modified hunt
  const huntIndex = hunts.value.findIndex((hunt: Hunt) => hunt.id === id)
  console.log(huntIndex, hunts.value)
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
  <v-btn @click="handleNewHunt" variant="outlined" color="primary" class="mt-8 w-[200px] mb-2">
    NEW HUNT
  </v-btn>
  <v-form @submit.prevent="handleUpdateStep(parseInt(stepRef))" :style="{ width: '200px' }">
    <v-text-field
      label="Step"
      v-model="stepRef"
      id="stepRef"
      name="stepRef"
      required
      bg-color="white"
    ></v-text-field>
  </v-form>
  <div
    class="my-15 border-1 rounded-lg py-8 px-2"
    :style="{
      width: '80vw',
      borderColor: '#ced2d1',
    }"
  >
    <v-form v-for="(hunt, index) in hunts" :key="hunt.id">
      <div class="grid md:grid-cols-5 sm:grid-cols-1 gap-4 align-center">
        <div class="grid justify-items-center">
          <img :src="hunt.sprite" class="max-w-40 max-h-40" />
        </div>
        <div class="grid justify-items-center">
          <h1 class="text-[24px]">{{ hunt.count }}</h1>
        </div>
        <div class="">
          <v-autocomplete
            label="Pokemon"
            @update:model-value="handleUpdatePokemon(hunt.id)"
            v-model="hunt.pokemon"
            name="pokemon"
            :items="allPokemonNames"
          ></v-autocomplete>
          <v-select
            label="Generation"
            @update:model-value="handleUpdateHunt(hunt.id)"
            v-model="hunt.generation"
            name="generation"
            :items="Array.from({ length: 9 }, (_, i) => i + 1)"
          >
          </v-select>
        </div>
        <div class="">
          <v-select
            label="Method"
            @change:model-value="handleUpdateHunt(hunt.id)"
            v-model="hunt.method"
            name="method"
            :items="Object.values(Method)"
          >
          </v-select>
          <v-text-field
            label="Phase"
            @change="handleUpdateHunt(hunt.id)"
            v-model="hunt.phase"
            name="phase"
            required
          ></v-text-field>
        </div>
        <div class="grid justify-items-center align-items-center mb-8">
          <v-layout>
            <v-checkbox
              label="Shiny Charm"
              @change="handleUpdateHunt(hunt.id)"
              v-model="hunt.shinyCharm"
              name="shinyCharm"
              density="compact"
              hide-details
            ></v-checkbox>
          </v-layout>
          <v-btn
            :variant="hunt.active ? 'flat' : 'outlined'"
            color="green"
            width="120"
            class="mt-1 mb-4"
            @click="handleSetActiveHunt(hunt.id)"
            >ACTIVE</v-btn
          >
          <!-- TODO: add warning -->
          <v-btn
            prepend-icon="mdi-trash-can-outline"
            variant="outlined"
            color="red"
            width="120"
            @click="handleDeleteHunt(hunt.id)"
            >DELETE</v-btn
          >
        </div>
      </div>
      <hr v-if="index !== hunts.length - 1" class="my-6" :style="{ color: '#ced2d1' }" />
    </v-form>
  </div>
</template>
