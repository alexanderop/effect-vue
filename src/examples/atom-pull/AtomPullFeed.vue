<script setup lang="ts">
import { useAtom } from '@effect/atom-vue'
import { feedAtom } from './atoms'

// Writing `void` pulls the next chunk.
const [feed, pullMore] = useAtom(() => feedAtom)
</script>

<template>
  <div>
    <ul v-if="feed._tag === 'Success'">
      <li v-for="item in feed.value.items" :key="item">{{ item }}</li>
    </ul>
    <div v-else class="value small muted">Loading…</div>

    <div class="actions">
      <button
        :disabled="feed.waiting || (feed._tag === 'Success' && feed.value.done)"
        @click="pullMore()"
      >
        <template v-if="feed.waiting">Pulling…</template>
        <template v-else-if="feed._tag === 'Success' && feed.value.done">End of stream</template>
        <template v-else>Load more</template>
      </button>
    </div>
  </div>
</template>
