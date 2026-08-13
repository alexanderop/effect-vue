<script setup lang="ts">
import { useAtom, useAtomValue } from '@effect/atom-vue'
import { selectedAtom, votesAtom } from './atoms'

const selected = useAtomValue(() => selectedAtom)

// Every composable takes a thunk, and the thunk is reactive. Selecting another
// framework resubscribes to that key's atom — which still holds its own count.
const [votes, setVotes] = useAtom(() => votesAtom(selected.value))
</script>

<template>
  <div>
    <div class="value">{{ votes }}</div>

    <div class="actions">
      <button @click="setVotes((v) => v + 1)">Vote for {{ selected }}</button>
    </div>
  </div>
</template>
