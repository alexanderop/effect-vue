<script setup lang="ts">
import { useAtomRef } from '@effect/atom-vue'
import { draftRef, lengthRef } from './atoms'

// Neither of these is written to. `draftRef` is the parent the prop refs write
// through, and `lengthRef` is derived from it with `map`.
const draft = useAtomRef(() => draftRef)
const length = useAtomRef(() => lengthRef)
</script>

<template>
  <div>
    <div class="stats">
      <div role="group" aria-label="Characters">
        <span>Characters</span>
        <strong>{{ length }}</strong>
      </div>
    </div>

    <div class="value small">{{ draft.title || 'Untitled' }}</div>

    <p class="hint">{{ draft.body || 'No body yet.' }}</p>
  </div>
</template>
