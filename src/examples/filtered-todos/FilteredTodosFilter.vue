<script setup lang="ts">
import { useAtom } from '@effect/atom-vue'
import { filterAtom, type Filter } from './atoms'

const [filter, setFilter] = useAtom(() => filterAtom)
const filters: ReadonlyArray<Filter> = ['all', 'open', 'done']
</script>

<template>
  <div class="actions standalone">
    <button
      v-for="option in filters"
      :key="option"
      :disabled="filter === option"
      @click="setFilter(option)"
    >
      {{ option.toUpperCase() }}
    </button>
  </div>
</template>
