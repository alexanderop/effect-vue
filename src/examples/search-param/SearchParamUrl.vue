<script setup lang="ts">
import { useAtomValue } from '@effect/atom-vue'
import { searchStringAtom } from './atoms'

const search = useAtomValue(() => searchStringAtom)
</script>

<template>
  <div>
    <div class="value small">{{ search || '(no parameters)' }}</div>

    <p class="hint">
      Read straight back off <strong>window.location.search</strong>. Writes land here about half a
      second late, because the atom batches them into one pushState.
    </p>
  </div>
</template>
