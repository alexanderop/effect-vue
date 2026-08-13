<script setup lang="ts">
import { useAtom, useAtomValue } from '@effect/atom-vue'
import ResultTable from './ResultTable.vue'
import { manualSearchAtom, resultsAtom } from './atoms'

const props = defineProps<{ query: string }>()
const results = useAtomValue(() => resultsAtom)
const [searchResult, search] = useAtom(() => manualSearchAtom)
</script>

<template>
  <div>
    <div class="actions standalone">
      <button :disabled="searchResult.waiting" @click="search(props.query || 'Item')">
        Search
      </button>
    </div>
    <p class="message">{{ results.length }} results</p>
    <ResultTable :results="results" />
  </div>
</template>
