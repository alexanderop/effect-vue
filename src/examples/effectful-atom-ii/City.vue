<script setup lang="ts">
import { useAtom } from '@effect/atom-vue'
import { cities, cityAtom } from './atoms'

const [city, setCity] = useAtom(() => cityAtom)
</script>

<template>
  <div>
    <div class="value small">{{ city.name }}</div>
    <div class="actions">
      <button
        v-for="option in cities"
        :key="option.name"
        :disabled="city.name === option.name"
        @click="setCity(option)"
      >
        {{ option.name }}
      </button>
    </div>
  </div>
</template>
