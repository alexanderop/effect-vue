<script setup lang="ts">
import { useAtom } from '@effect/atom-vue'
import { fahrenheitAtom } from './atoms'

// Writing to the derived atom writes through to `celsiusAtom`, and both panels
// stay in sync.
const [fahrenheit, setFahrenheit] = useAtom(() => fahrenheitAtom)
</script>

<template>
  <div>
    <div class="value">{{ fahrenheit }}&deg;F</div>

    <div class="actions">
      <button @click="setFahrenheit((f) => f - 10)">-10&deg;</button>
      <button @click="setFahrenheit((f) => f + 10)">+10&deg;</button>
    </div>
  </div>
</template>
