<script setup lang="ts">
import { inject } from 'vue'

interface ThemeContext {
  isDark: boolean
  toggleTheme: () => void
}

const defaultThemeContext: ThemeContext = {
  isDark: false,
  toggleTheme: () => {},
}

const { isDark, toggleTheme } = inject<ThemeContext>('theme') || defaultThemeContext
</script>

<template>
  <div class="flex flex-row absolute right-0 mr-4">
    <v-layout>
      <v-icon icon="mdi-white-balance-sunny" color="#e8ba17" size="24" class="mt-4 mr-2"></v-icon>
      <v-switch @click="toggleTheme" v-model="isDark" inset hide-details></v-switch>
      <v-icon icon="mdi-moon-waning-crescent" color="#e8ba17" size="24" class="mt-4 ml-2"></v-icon>
    </v-layout>
  </div>
</template>
