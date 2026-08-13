<script setup lang="ts">
import type { SearchResult } from './atoms'

defineProps<{ results: ReadonlyArray<SearchResult> }>()
</script>

<template>
  <table class="results-table">
    <tbody>
      <tr v-for="result in results" :key="result.id">
        <td>{{ result.title }}</td>
        <td>{{ result.description }}</td>
      </tr>
    </tbody>
  </table>
</template>
