<script setup lang="ts">
import { useAtom } from '@effect/atom-vue'
import StreamingSearchResults from './StreamingSearchResults.vue'
import { scanSearchAtom } from './atoms'

const props = defineProps<{ query: string }>()
const [results, search] = useAtom(() => scanSearchAtom)
</script>

<template>
  <div>
    <div class="actions standalone">
      <button :disabled="results.waiting" @click="search(props.query || 'Item')">Search</button>
    </div>
    <template v-if="results._tag === 'Success'">
      <p class="message">{{ results.value.length }} results</p>
      <StreamingSearchResults :results="results.value" />
    </template>
    <p v-else-if="results._tag === 'Failure'" class="message error-text">Error loading results</p>
    <p v-else class="message muted">Ready to search</p>
  </div>
</template>
