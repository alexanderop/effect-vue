<script setup lang="ts">
import { useAtom } from '@effect/atom-vue'
import { textAtom } from './atoms'

const [text, setText] = useAtom(() => textAtom)
</script>

<template>
  <input
    :value="text"
    placeholder="Enter text..."
    @input="setText(($event.target as HTMLInputElement).value)"
  />
</template>
