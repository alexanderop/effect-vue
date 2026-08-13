<script setup lang="ts">
import { useAtomValue } from '@effect/atom-vue'
import { booksAtom } from './atoms'

// The slow one: 900ms.
const books = useAtomValue(() => booksAtom)
</script>

<template>
  <div v-if="books._tag === 'Success'" class="value" :style="{ opacity: books.waiting ? 0.35 : 1 }">
    {{ books.value }}
  </div>
  <div v-else class="value muted small">Loading…</div>
</template>
