<script setup lang="ts">
import { ref } from 'vue'
import { Atom, useAtom } from '@effect/atom-vue'
import { searchAtom } from './atoms'

const query = ref('a')

const [results, search] = useAtom(() => searchAtom)
</script>

<template>
  <div>
    <input v-model="query" placeholder="Search fruit…" @keyup.enter="search(query)" />

    <ul v-if="results._tag === 'Success' && !results.waiting">
      <li v-for="fruit in results.value" :key="fruit">{{ fruit }}</li>
      <li v-if="results.value.length === 0">No matches</li>
    </ul>
    <div v-else class="value small muted">
      {{ results.waiting ? 'Searching…' : 'Press search' }}
    </div>

    <div class="actions">
      <!-- Writing `Atom.Reset` puts the atom back into its Initial state. -->
      <button @click="search(Atom.Reset)">Reset</button>
      <button :disabled="results.waiting" @click="search(query)">Search</button>
    </div>
  </div>
</template>
