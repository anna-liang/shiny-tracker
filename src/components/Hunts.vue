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
  <!-- TODO: change to editable text -->
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
      <div class="grid grid-cols-5 gap-4 align-center">
        <div class="grid justify-items-center">
          <img :src="hunt.sprite" class="max-w-40 max-h-40" />
        </div>
        <div class="grid justify-items-center border-amber-500 border-2">
          <h1 class="text-[24px]">{{ hunt.count }}</h1>
        </div>
        <div class="">
          <v-text-field
            label="Pokemon"
            @change="handleUpdatePokemon(hunt.id)"
            v-model="hunt.pokemon"
            name="pokemon"
          ></v-text-field>
          <v-select
            label="Generation"
            @update:modelValue="handleUpdateHunt(hunt.id)"
            v-model="hunt.generation"
            name="generation"
            :items="Array.from({ length: 9 }, (_, i) => i + 1)"
          >
            <option selected>--</option>
            <option v-for="gen in 9" :key="gen">{{ gen }}</option>
          </v-select>
        </div>
        <div class="">
          <v-select
            label="Method"
            @change:modelValue="handleUpdateHunt(hunt.id)"
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
        <div class="grid justify-items-center">
          <v-checkbox
            label="Shiny Charm"
            @change="handleUpdateHunt(hunt.id)"
            v-model="hunt.shinyCharm"
            name="shinyCharm"
          ></v-checkbox>
          <v-btn
            :variant="hunt.active ? 'flat' : 'outlined'"
            color="green"
            @click="handleSetActiveHunt(hunt.id)"
            >ACTIVE</v-btn
          >
          <!-- TODO: add warning -->
          <v-btn
            prepend-icon="mdi-trash-can-outline"
            variant="outlined"
            color="red"
            @click="handleDeleteHunt(hunt.id)"
            >DELETE</v-btn
          >
        </div>
      </div>
      <hr v-if="index !== hunts.length - 1" class="my-6" :style="{ color: '#ced2d1' }" />
    </v-form>
  </div>
</template>
