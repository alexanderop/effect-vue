<script setup lang="ts">
import { useAtomValue } from '@effect/atom-vue'
import FilteredTodosItem from './FilteredTodosItem.vue'
import { filteredTodosAtom } from './atoms'

const todos = useAtomValue(() => filteredTodosAtom)
</script>

<template>
  <div v-if="todos._tag === 'Success'">
    <FilteredTodosItem v-for="todo in todos.value" :id="todo.id" :key="todo.id" />
    <div v-if="todos.value.length === 0" class="value small muted">No todos to show</div>
  </div>
  <div v-else-if="todos._tag === 'Failure'" class="value error">
    Error: {{ String(todos.cause) }}
  </div>
  <div v-else class="value small muted">Loading...</div>
</template>
