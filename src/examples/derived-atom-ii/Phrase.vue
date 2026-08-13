<script setup lang="ts">
import { useAtom } from '@effect/atom-vue'
import { phraseAtom } from './atoms'

const [phrase, setPhrase] = useAtom(() => phraseAtom)
</script>

<template>
  <input
    :value="phrase"
    placeholder="Say something…"
    @input="setPhrase(($event.target as HTMLInputElement).value)"
  />
</template>
