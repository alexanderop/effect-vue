<script setup lang="ts">
import { useAtom } from '@effect/atom-vue'
import { countAtom } from './atoms'

const [count, setCount] = useAtom(() => countAtom)
</script>

<template>
  <div>
    <div class="value">{{ count }}</div>
    <div class="actions">
      <button @click="setCount((current) => current - 1)">Decrease</button>
      <button @click="setCount(0)">Reset</button>
      <button @click="setCount((current) => current + 1)">Increase</button>
    </div>
  </div>
</template>
