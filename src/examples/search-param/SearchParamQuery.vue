<script setup lang="ts">
import { useAtom } from '@effect/atom-vue'
import { queryAtom } from './atoms'

const [query, setQuery] = useAtom(() => queryAtom)
</script>

<template>
  <div>
    <div class="inline-form">
      <input
        aria-label="Query"
        placeholder="Search…"
        :value="query"
        @input="setQuery(($event.target as HTMLInputElement).value)"
      />
    </div>

    <p class="hint">
      Reads and writes <strong>?q=</strong> directly. Nothing here knows about the router — the
      parameter is the state.
    </p>
  </div>
</template>
