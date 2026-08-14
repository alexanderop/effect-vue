<script setup lang="ts">
import { ref } from 'vue'
import { useAtomSet } from '@effect/atom-vue'
import { createTodoAtom } from './atoms'

const text = ref('')
const createTodo = useAtomSet(() => createTodoAtom)

const submit = () => {
  const value = text.value.trim()
  if (!value) return
  createTodo({ id: crypto.randomUUID(), text: value })
  text.value = ''
}
</script>

<template>
  <form class="inline-form" @submit.prevent="submit">
    <input v-model="text" placeholder="What needs to be done?" />
    <button type="submit" :disabled="!text.trim()">Add</button>
  </form>
</template>
