<script setup lang="ts">
import { Method, type Hunt } from '@/types'
import { v4 as uuidv4 } from 'uuid'
import { ref, onMounted, inject, nextTick } from 'vue'
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
const stepRef = ref<string | number>(step)

onMounted(async () => {
  const storedHunts = localStorage.getItem('hunts')
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
    console.error('Error fetching Pokemon', error)
  }
})

const setHuntsInLocalStorage = () => {
  try {
    nextTick(() => localStorage.setItem('hunts', JSON.stringify(hunts.value)))
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

const handleUpdatePokemon = (id: string) => {
  // find modified hunt
  nextTick(async () => {
    const huntIndex = hunts.value.findIndex((hunt: Hunt) => hunt.id === id)
    if (huntIndex !== -1) {
      const hunt = hunts.value[huntIndex]
      try {
        // replace whitespace with -
        const pokemonResult = await axios.get(
          `https://pokeapi.co/api/v2/pokemon/${hunt?.pokemon?.replace(/[' ']/g, '-')}`,
        )
        hunt.pokemonId = pokemonResult.data.id
        hunt.sprite = pokemonResult.data.sprites.other.showdown.front_shiny
        handleUpdateHunt(id)
        // if updated pokemon is active
        if (hunt.active) handleSetActiveHunt(id)
      } catch (error) {
        console.error('Error fetching Pokemon', error)
      }
    }
  })
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
    // if deleting active pokemon, set to default
    if (hunts.value[huntIndex].active)
      handleUpdateActiveHunt({
        id: '',
        count: 0,
        method: Method.RE,
        phase: 0,
        shinyCharm: false,
        active: false,
      })
    hunts.value.splice(huntIndex, 1)
    setHuntsInLocalStorage()
  }
}

const handleSetActiveHunt = (id: string) => {
  hunts.value.forEach((hunt: Hunt) => {
    if (hunt.id === id) {
      hunt.active = true
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
  <v-text-field
    label="Step"
    v-model="step"
    @update:model-value="handleUpdateStep(parseInt(stepRef.toString()))"
    id="stepRef"
    name="stepRef"
    required
    bg-color="white"
    :style="{ width: '200px' }"
  ></v-text-field>
  <div
    :class="['my-15', hunts.length > 0 ? 'border-1' : 'border-0', 'rounded-lg', 'py-8', 'px-2']"
    :style="{
      width: '80vw',
      borderColor: '#ced2d1',
    }"
  >
    <v-form v-for="(hunt, index) in hunts" :key="hunt.id">
      <div class="grid grid-cols-1 md:grid-cols-5 md:gap-4 align-center">
        <div class="grid justify-items-center">
          <img :src="hunt.sprite" class="max-w-35 max-h-35 lg:max-w-40 lg:max-h-40" />
        </div>
        <div class="grid justify-items-center">
          <h1 class="text-[24px] md:my-0 my-8">{{ hunt.count }}</h1>
        </div>
        <div>
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
        <div>
          <v-select
            label="Method"
            @update:model-value="handleUpdateHunt(hunt.id)"
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
            class="mt-1 ml-1 mb-4 w-[120px] md:w-[100px] lg:w-[120px]"
            @click="handleSetActiveHunt(hunt.id)"
            >ACTIVE</v-btn
          >
          <!-- TODO: add warning -->
          <v-btn
            prepend-icon="mdi-trash-can-outline"
            variant="outlined"
            color="red"
            class="ml-1 w-[120px] md:w-[100px] lg:w-[120px]"
            @click="handleDeleteHunt(hunt.id)"
            >DELETE</v-btn
          >
        </div>
      </div>
      <hr v-if="index !== hunts.length - 1" class="my-6" :style="{ color: '#ced2d1' }" />
    </v-form>
  </div>
</template>
