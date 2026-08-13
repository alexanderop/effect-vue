<script setup lang="ts">
import { computed } from 'vue'
import { useAtomValue } from '@effect/atom-vue'
import { todosAtom } from './atoms'

const todos = useAtomValue(() => todosAtom)
const stats = computed(() => {
  const values = todos.value._tag === 'Success' ? todos.value.value : []
  return {
    all: values.length,
    open: values.filter((todo) => !todo.completed).length,
    done: values.filter((todo) => todo.completed).length,
  }
})
</script>

<template>
  <div class="stats">
    <div>
      <strong>{{ stats.all }}</strong
      ><span>ALL</span>
    </div>
    <div>
      <strong>{{ stats.open }}</strong
      ><span>OPEN</span>
    </div>
    <div>
      <strong>{{ stats.done }}</strong
      ><span>DONE</span>
    </div>
  </div>
</template>
