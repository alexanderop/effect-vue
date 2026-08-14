<script setup lang="ts">
import { useAtomValue } from '@effect/atom-vue'
import { resultsAtom } from './atoms'

const results = useAtomValue(() => resultsAtom)
</script>

<template>
  <div>
    <template v-if="results._tag === 'Success'">
      <div class="stats">
        <div role="group" aria-label="Searches run">
          <span>Searches run</span>
          <strong>{{ results.value.run }}</strong>
        </div>
        <div role="group" aria-label="Matches">
          <span>Matches</span>
          <strong>{{ results.value.matches.length }}</strong>
        </div>
      </div>

      <table v-if="results.value.matches.length > 0" class="results-table">
        <tbody>
          <tr v-for="name in results.value.matches" :key="name">
            <td>{{ name }}</td>
          </tr>
        </tbody>
      </table>

      <p v-else class="hint">
        {{
          results.value.query === ''
            ? 'Type to search.'
            : `No module matches “${results.value.query}”.`
        }}
      </p>
    </template>

    <div v-else class="value small">—</div>

    <p v-if="results.waiting" class="hint muted">Searching…</p>
  </div>
</template>
