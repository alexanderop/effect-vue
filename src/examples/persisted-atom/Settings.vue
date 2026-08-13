<script setup lang="ts">
import { useAtom } from '@effect/atom-vue'
import { nameAtom, themeAtom } from './atoms'

const [name, setName] = useAtom(() => nameAtom)
const [theme, setTheme] = useAtom(() => themeAtom)
</script>

<template>
  <div>
    <input
      :value="name"
      placeholder="Your name"
      @input="setName(($event.target as HTMLInputElement).value)"
    />

    <div class="row">
      <span class="label">theme</span>
      <span>{{ theme }}</span>
    </div>

    <div class="actions">
      <button @click="setTheme(theme === 'dark' ? 'light' : 'dark')">Toggle theme</button>
    </div>

    <div class="hint">Both values live in localStorage. Reload the page.</div>
  </div>
</template>
