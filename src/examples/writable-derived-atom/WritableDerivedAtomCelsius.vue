<script setup lang="ts">
import { useAtom } from '@effect/atom-vue'
import { celsiusAtom } from './atoms'

const [celsius, setCelsius] = useAtom(() => celsiusAtom)
</script>

<template>
  <div>
    <div class="value">{{ celsius.toFixed(1) }}&deg;C</div>

    <div class="actions">
      <button @click="setCelsius((c) => c - 5)">-5&deg;</button>
      <button @click="setCelsius((c) => c + 5)">+5&deg;</button>
    </div>
  </div>
</template>
