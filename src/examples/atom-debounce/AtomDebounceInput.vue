<script setup lang="ts">
import { useAtom, useAtomValue } from '@effect/atom-vue'
import { debouncedQueryAtom, queryAtom } from './atoms'

const [query, setQuery] = useAtom(() => queryAtom)

// The same value, republished only once typing stops.
const debounced = useAtomValue(() => debouncedQueryAtom)
</script>

<template>
  <div>
    <div class="inline-form">
      <input
        aria-label="Query"
        placeholder="Type a module name…"
        :value="query"
        @input="setQuery(($event.target as HTMLInputElement).value)"
      />
    </div>

    <div class="stats">
      <div role="group" aria-label="Typed">
        <span>Typed</span>
        <strong>{{ query || '—' }}</strong>
      </div>
      <div role="group" aria-label="Debounced">
        <span>Debounced</span>
        <strong>{{ debounced || '—' }}</strong>
      </div>
    </div>

    <p class="hint">
      The left value tracks every keystroke. The right one lags behind it by the debounce window,
      and it is the only one the search reads.
    </p>
  </div>
</template>
