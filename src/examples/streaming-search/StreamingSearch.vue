<script setup lang="ts">
import { computed, ref } from 'vue'
import StreamingSearchManual from './StreamingSearchManual.vue'
import StreamingSearchPull from './StreamingSearchPull.vue'
import StreamingSearchScan from './StreamingSearchScan.vue'

type Pattern = 'scan' | 'pull' | 'manual'

const selected = ref<Pattern>('scan')
const query = ref('')

const detailsByPattern: Record<Pattern, { title: string; description: string }> = {
  scan: {
    title: 'Pattern 1: Stream.scan',
    description:
      'Uses Atom.fn with Stream.scan to accumulate results in-stream. Best for real-time feeds where all data streams at once.',
  },
  pull: {
    title: 'Pattern 2: Atom.pull',
    description:
      'Pulls results in chunks of five. Best for pagination where the reader controls demand.',
  },
  manual: {
    title: 'Pattern 3: Manual state',
    description:
      'Writes each streamed result into a separate atom for fully custom state management.',
  },
}

const details = computed(() => detailsByPattern[selected.value])
</script>

<template>
  <div class="streaming-shell">
    <div class="streaming-intro">
      <h2>Streaming Search Patterns</h2>
      <p>Three approaches to streaming table results with Effect Atom</p>
    </div>

    <div class="pattern-tabs">
      <button :class="{ active: selected === 'scan' }" @click="selected = 'scan'">
        Pattern 1: Scan
      </button>
      <button :class="{ active: selected === 'pull' }" @click="selected = 'pull'">
        Pattern 2: Pull
      </button>
      <button :class="{ active: selected === 'manual' }" @click="selected = 'manual'">
        Pattern 3: Manual
      </button>
    </div>

    <input v-model="query" placeholder="Search items..." />

    <div class="pattern-description">
      <h3>{{ details.title }}</h3>
      <p>{{ details.description }}</p>
    </div>

    <StreamingSearchScan v-if="selected === 'scan'" :query="query" />
    <StreamingSearchPull v-else-if="selected === 'pull'" />
    <StreamingSearchManual v-else :query="query" />
  </div>
</template>
