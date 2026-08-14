<script setup lang="ts">
import { computed } from 'vue'
import { useAtom } from '@effect/atom-vue'
import StreamingSearchResults from './StreamingSearchResults.vue'
import { pullSearchAtom } from './atoms'

const [results, loadMore] = useAtom(() => pullSearchAtom)
const items = computed(() =>
  results.value._tag === 'Success' ? Array.from(results.value.value.items) : [],
)
</script>

<template>
  <div>
    <template v-if="results._tag === 'Success'">
      <p class="message">{{ items.length }} results loaded</p>
      <StreamingSearchResults :results="items" />
      <div v-if="!results.value.done" class="actions standalone">
        <button :disabled="results.waiting" @click="loadMore()">
          {{ results.waiting ? 'Loading...' : 'Load More (5)' }}
        </button>
      </div>
    </template>
    <p v-else-if="results._tag === 'Failure'" class="message error-text">Error loading results</p>
    <p v-else class="message muted">Loading initial results...</p>
  </div>
</template>
