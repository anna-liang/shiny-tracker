<script setup lang="ts">
import HomeView from './Views/HomeView.vue'
import { useTheme } from 'vuetify'
import { provide, ref, onMounted } from 'vue'

const theme = useTheme()
const isDark = ref(theme.current.value.dark)

onMounted(() => {
  try {
    const storedTheme = localStorage.getItem('theme')
    if (storedTheme !== null) {
      isDark.value = storedTheme === 'dark'
      theme.change(storedTheme)
    } else {
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    }
  } catch (error) {
    console.error('Error fetching theme', error)
  }
})

const toggleTheme = () => {
  theme.toggle()
  localStorage.setItem('theme', isDark.value ? 'light' : 'dark')
}

provide('theme', { isDark, toggleTheme })
</script>

<template>
  <HomeView />
</template>
