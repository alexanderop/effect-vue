<script setup lang="ts">
import { useAtomValue } from '@effect/atom-vue'
import TodoItem from './TodoItem.vue'
import { todosAtom } from './atoms'

const todos = useAtomValue(() => todosAtom)
</script>

<template>
  <div v-if="todos._tag === 'Success'">
    <TodoItem v-for="todo in todos.value" :id="todo.id" :key="todo.id" />
    <div v-if="todos.value.length === 0" class="value small muted">
      No todos yet. Create one to get started!
    </div>
  </div>
  <div v-else-if="todos._tag === 'Failure'" class="value error">
    Error: {{ String(todos.cause) }}
  </div>
  <div v-else class="value small muted">Loading...</div>
</template>
