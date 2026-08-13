<script setup lang="ts">
import { useAtomValue } from '@effect/atom-vue'
import { booksCountAtom } from './atoms'

const books = useAtomValue(() => booksCountAtom)
</script>

<template>
  <div v-if="books._tag === 'Success'" class="value" :class="{ waiting: books.waiting }">
    📚 {{ books.value }}
  </div>
  <div v-else-if="books._tag === 'Failure'" class="value error">
    Error: {{ String(books.cause) }}
  </div>
  <div v-else class="value small muted">Loading...</div>
</template>
