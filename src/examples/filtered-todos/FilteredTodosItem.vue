<script setup lang="ts">
import { useAtomSet, useAtomValue } from '@effect/atom-vue'
import { deleteTodoAtom, todoAtom, toggleTodoAtom } from './atoms'

const props = defineProps<{ id: string }>()

const todo = useAtomValue(() => todoAtom(props.id))
const toggleTodo = useAtomSet(() => toggleTodoAtom)
const deleteTodo = useAtomSet(() => deleteTodoAtom)
</script>

<template>
  <div v-if="todo._tag === 'Success' && todo.value" class="todo-row">
    <button class="todo-toggle" :aria-label="`Toggle ${todo.value.text}`" @click="toggleTodo(id)">
      {{ todo.value.completed ? '✓' : '○' }}
    </button>
    <span :class="{ completed: todo.value.completed }">{{ todo.value.text }}</span>
    <button class="todo-delete" @click="deleteTodo(id)">Delete</button>
  </div>
</template>
