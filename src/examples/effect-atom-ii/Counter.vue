<script setup lang="ts">
import { useAtom } from '@effect/atom-vue'
import { countAtom } from './atoms'

const [count, setCount] = useAtom(() => countAtom)
</script>

<template>
  <div>
    <div class="value">{{ count }}</div>

    <div class="actions">
      <button @click="setCount((c) => Math.max(1, c - 1))">Decrease</button>
      <button @click="setCount(3)">Reset</button>
      <button @click="setCount((c) => Math.min(10, c + 1))">Increase</button>
    </div>
  </div>
</template>
